/**
 * @jest-environment node
 */
import axios from "axios";
import { POST } from "@/app/api/contact/route";

jest.mock("axios");
const post = axios.post as jest.Mock;

const WEBHOOK = "https://discord.example/api/webhooks/123/secret-token";
const valid = {
  name: "Maria Silva",
  email: "maria@empresa.com",
  message: "Oi, Eduardo!",
};

const makeRequest = (
  body: unknown,
  headers: Record<string, string> = { "content-type": "application/json" }
) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// A request whose body is streamed in chunks, with no content-length header.
const makeStreamRequest = (chunks: Uint8Array[], onCancel?: () => void) => {
  let i = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i < chunks.length) controller.enqueue(chunks[i++]);
      else controller.close();
    },
    cancel() {
      onCancel?.();
    },
  });
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: stream,
    // @ts-expect-error duplex is required by undici for stream bodies
    duplex: "half",
  });
};

describe("POST /api/contact", () => {
  let errorSpy: jest.SpyInstance;
  beforeEach(() => {
    process.env.WEBHOOK_URL = WEBHOOK;
    post.mockReset().mockResolvedValue({ status: 204 });
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });
  afterAll(() => {
    delete process.env.WEBHOOK_URL;
  });

  it("valid body -> 200 { ok: true } and posts to the webhook with a 10s timeout", async () => {
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(post).toHaveBeenCalledTimes(1);
    const [url, payload, config] = post.mock.calls[0];
    expect(url).toBe(WEBHOOK);
    expect(config).toEqual({ timeout: 10000, maxRedirects: 0 });
    const json = JSON.stringify(payload);
    expect(json).toContain("Maria Silva");
    expect(json).toContain("maria@empresa.com");
    expect(payload.allowed_mentions).toEqual({ parse: [] });
  });

  it("sends only validated, trimmed fields", async () => {
    await POST(
      makeRequest({ ...valid, name: "  Maria Silva ", admin: "yes", webhook: "x" })
    );
    const json = JSON.stringify(post.mock.calls[0][1]);
    expect(json).not.toContain("admin");
    expect(json).not.toContain('"webhook"');
    expect(json).not.toContain("  Maria");
  });

  it.each([
    ["invalid email", { ...valid, email: "nope" }],
    ["short name", { ...valid, name: "a" }],
    ["empty message", { ...valid, message: "  " }],
    ["long message", { ...valid, message: "x".repeat(501) }],
    ["missing fields", {}],
    ["array body", []],
    ["null body", null],
  ])("%s -> 400 invalid_input", async (_l, body) => {
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
    expect(post).not.toHaveBeenCalled();
  });

  it("broken JSON -> 400 invalid_input", async () => {
    const res = await POST(makeRequest("{not json"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
  });

  it("non-JSON content-type -> 400 invalid_input", async () => {
    const res = await POST(
      makeRequest(JSON.stringify(valid), { "content-type": "text/plain" })
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
    expect(post).not.toHaveBeenCalled();
  });

  it("oversized body -> 400 invalid_input", async () => {
    const res = await POST(makeRequest({ ...valid, pad: "x".repeat(11 * 1024) }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
    expect(post).not.toHaveBeenCalled();
  });

  it("oversized content-length header -> 400 invalid_input", async () => {
    const res = await POST(
      makeRequest(valid, {
        "content-type": "application/json",
        "content-length": "20000",
      })
    );
    expect(res.status).toBe(400);
    expect(post).not.toHaveBeenCalled();
  });

  it("webhook error -> 502 delivery_failed without leaking details", async () => {
    post.mockRejectedValue(
      Object.assign(new Error(`Request failed for ${WEBHOOK}`), {
        isAxiosError: true,
        response: { status: 500, data: "internal webhook detail" },
      })
    );
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(502);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ ok: false, error: "delivery_failed" });
    expect(text).not.toContain("secret-token");
    expect(text).not.toContain("internal webhook detail");
    expect(text).not.toContain("Request failed");
  });

  it("webhook timeout -> 502 delivery_failed", async () => {
    post.mockRejectedValue(
      Object.assign(new Error("timeout of 10000ms exceeded"), {
        isAxiosError: true,
        code: "ECONNABORTED",
      })
    );
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "delivery_failed" });
  });

  it("missing WEBHOOK_URL -> 500 unexpected, logged server-side only", async () => {
    delete process.env.WEBHOOK_URL;
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false, error: "unexpected" });
    expect(post).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("does not log the user's message or email", async () => {
    post.mockRejectedValue(new Error("boom"));
    await POST(makeRequest(valid));
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain("Oi, Eduardo!");
    expect(logged).not.toContain("maria@empresa.com");
    expect(logged).not.toContain("secret-token");
  });

  it("unexpected throw -> 500 unexpected with a PII-free log", async () => {
    const broken = {
      headers: {
        get() {
          throw new Error("kaboom maria@empresa.com");
        },
      },
    } as unknown as Request;
    const res = await POST(broken);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false, error: "unexpected" });
    expect(errorSpy).toHaveBeenCalledWith("[contact] unexpected");
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("maria@empresa.com");
  });

  it("oversized streamed body without content-length -> 400 and stops reading", async () => {
    const chunk = new Uint8Array(4 * 1024).fill(97);
    const onCancel = jest.fn();
    const res = await POST(makeStreamRequest([chunk, chunk, chunk, chunk, chunk], onCancel));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
    expect(onCancel).toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });

  it("normal streamed body without content-length is accepted", async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(valid));
    const res = await POST(makeStreamRequest([bytes.slice(0, 10), bytes.slice(10)]));
    expect(res.status).toBe(200);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it.each(["abc", "-5", "NaN", "Infinity"])("invalid content-length %s -> 400", async (len) => {
    const res = await POST(
      makeRequest(valid, { "content-type": "application/json", "content-length": len })
    );
    expect(res.status).toBe(400);
    expect(post).not.toHaveBeenCalled();
  });

  it.each(["text/plain; x=application/json", "text/application/json"])(
    "content-type %s -> 400",
    async (ct) => {
      const res = await POST(makeRequest(valid, { "content-type": ct }));
      expect(res.status).toBe(400);
      expect(post).not.toHaveBeenCalled();
    }
  );

  it("accepts application/json with charset", async () => {
    const res = await POST(
      makeRequest(valid, { "content-type": "Application/JSON; charset=utf-8" })
    );
    expect(res.status).toBe(200);
  });

  it("filled honeypot -> 200 { ok: true } without calling the webhook", async () => {
    const res = await POST(makeRequest({ ...valid, company_url: " http://spam.example " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(post).not.toHaveBeenCalled();
  });

  it("oversized honeypot never 400s: decoy 200 without calling the webhook", async () => {
    const res = await POST(makeRequest({ ...valid, company_url: "x".repeat(500) }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(post).not.toHaveBeenCalled();
  });

  it("empty or whitespace honeypot still delivers", async () => {
    const res = await POST(makeRequest({ ...valid, company_url: "   " }));
    expect(res.status).toBe(200);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("cross-origin Origin header -> 400 invalid_input", async () => {
    const res = await POST(
      makeRequest(valid, {
        "content-type": "application/json",
        host: "portfolio.example",
        origin: "https://evil.example",
      })
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_input" });
    expect(post).not.toHaveBeenCalled();
  });

  it("same-origin Origin header is accepted", async () => {
    const res = await POST(
      makeRequest(valid, {
        "content-type": "application/json",
        host: "portfolio.example",
        origin: "https://portfolio.example",
      })
    );
    expect(res.status).toBe(200);
  });

  it("malformed Origin header -> 400", async () => {
    const res = await POST(
      makeRequest(valid, {
        "content-type": "application/json",
        host: "portfolio.example",
        origin: "not a url",
      })
    );
    expect(res.status).toBe(400);
  });

  it("strips control characters before delivery", async () => {
    await POST(makeRequest({ ...valid, name: "Maria  Silva" }));
    expect(JSON.stringify(post.mock.calls[0][1])).not.toContain("\u0000");
    expect(post.mock.calls[0][1].embeds[0].fields[0].value).toBe("Maria Silva");
  });
});
