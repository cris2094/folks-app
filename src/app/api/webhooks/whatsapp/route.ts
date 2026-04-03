import { NextResponse } from "next/server";
import { processWhatsAppMessage } from "@/features/folky/actions/process-message";

// GET: Webhook verification (Meta requires this)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST: Receive messages from WhatsApp
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Extract message from WhatsApp webhook payload
  const entry = (body.entry as Array<Record<string, unknown>>)?.[0];
  const changes = (entry?.changes as Array<Record<string, unknown>>)?.[0];
  const value = changes?.value as Record<string, unknown>;
  const messages = value?.messages as Array<Record<string, unknown>>;

  if (!messages?.length) {
    // Status update or other non-message event
    return NextResponse.json({ received: true });
  }

  const message = messages[0];
  const from = message.from as string;
  const messageType = message.type as string;
  let text = "";

  if (messageType === "text") {
    text = ((message.text as Record<string, unknown>)?.body as string) ?? "";
  } else if (messageType === "interactive") {
    const interactive = message.interactive as Record<string, unknown>;
    const buttonReply = interactive?.button_reply as Record<string, unknown>;
    text = (buttonReply?.id as string) ?? (buttonReply?.title as string) ?? "";
  }

  if (text && from) {
    // Process asynchronously — don't block the webhook response
    processWhatsAppMessage(from, text).catch((err) =>
      console.error("Folky error:", err),
    );
  }

  // Always respond 200 quickly to Meta
  return NextResponse.json({ received: true });
}
