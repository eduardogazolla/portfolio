import axios from "axios";
import { NextResponse } from "next/server";
import { createContactSchema } from "@/app/lib/contact-schema";

const MAX_BODY_BYTES = 10 * 1024;
const WEBHOOK_TIMEOUT_MS = 10_000;

// The server only needs pass/fail, so the locale of the messages is irrelevant.
const contactSchema = createContactSchema("pt");

type ErrorCode = "invalid_input" | "delivery_failed" | "unexpected";

const fail = (status: number, error: ErrorCode) =>
  NextResponse.json({ ok: false, error }, { status });

// Origin/host checks and the streamed body reader rely on Node APIs.
export const runtime = "nodejs";

const JSON_CONTENT_TYPE = /^application\/json\s*(;|$)/i;

// Reads the body as text, giving up as soon as it passes MAX_BODY_BYTES so an
// unbounded (or chunked, no content-length) body is never fully buffered.
const readBodyCapped = async (request: Request): Promise<string | null> => {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return null;
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch {
    return null;
  }
};

// Browsers always send Origin on cross-origin POSTs; a missing Origin
// (curl, server-to-server) is allowed, a mismatching one is not.
const isCrossOrigin = (request: Request): boolean => {
  const origin = request.headers.get("origin");
  if (origin === null) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
};

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch {
    console.error("[contact] unexpected");
    return fail(500, "unexpected");
  }
}

async function handle(request: Request) {
  if (!JSON_CONTENT_TYPE.test(request.headers.get("content-type") ?? "")) {
    return fail(400, "invalid_input");
  }
  if (isCrossOrigin(request)) {
    return fail(400, "invalid_input");
  }
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (!Number.isFinite(declared) || declared < 0 || declared > MAX_BODY_BYTES) {
      return fail(400, "invalid_input");
    }
  }

  const raw = await readBodyCapped(request);
  if (raw === null) {
    return fail(400, "invalid_input");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "invalid_input");
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "invalid_input");
  }
  const { name, email, message, company_url } = parsed.data;

  // Honeypot: only bots fill the hidden field. Pretend success, deliver nothing.
  if (company_url.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[contact] WEBHOOK_URL is not configured");
    return fail(500, "unexpected");
  }

  // User content goes into embed fields as plain text; allowed_mentions
  // stops @everyone/@role/@user from pinging anyone.
  const payload = {
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: "Mensagem de Contato",
        color: 16711680,
        fields: [
          { name: "Nome", value: name, inline: true },
          { name: "E-mail", value: email, inline: true },
          { name: "Mensagem", value: message },
        ],
      },
    ],
  };

  try {
    await axios.post(webhookUrl, payload, { timeout: WEBHOOK_TIMEOUT_MS, maxRedirects: 0 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log only the failure type/status, never the user's data or the URL.
    const status = (err as { response?: { status?: number } })?.response?.status;
    const code = (err as { code?: string })?.code;
    console.error("[contact] webhook delivery failed", { status, code });
    return fail(502, "delivery_failed");
  }
}
