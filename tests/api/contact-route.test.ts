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
    expect(config).toEqual({ timeout: 10000 });
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
});
