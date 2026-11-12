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

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(400, "invalid_input");
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return fail(400, "invalid_input");
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(400, "invalid_input");
  }
  if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
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
  const { name, email, message } = parsed.data;

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
    await axios.post(webhookUrl, payload, { timeout: WEBHOOK_TIMEOUT_MS });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log only the failure type/status, never the user's data or the URL.
    const status = (err as { response?: { status?: number } })?.response?.status;
    const code = (err as { code?: string })?.code;
    console.error("[contact] webhook delivery failed", { status, code });
    return fail(502, "delivery_failed");
  }
}
