import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

interface WompiEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      reference: string;
      status: string;
      amount_in_cents: number;
    };
  };
  signature: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
}

function verifySignature(event: WompiEvent): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return false;

  const properties = event.signature.properties;
  const values = properties.map((prop) => {
    const parts = prop.split(".");
    let value: unknown = event;
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return value;
  });

  const concatenated = values.join("") + event.timestamp + secret;
  const hash = crypto.createHash("sha256").update(concatenated).digest("hex");

  return hash === event.signature.checksum;
}

export async function POST(request: Request) {
  let event: WompiEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic payload validation
  if (!event?.signature?.properties?.length || !event?.signature?.checksum || !event?.timestamp) {
    return NextResponse.json({ error: "Malformed event" }, { status: 400 });
  }

  // Verify signature
  if (!verifySignature(event)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Only handle approved transactions
  if (event.event !== "transaction.updated") {
    return NextResponse.json({ received: true });
  }

  const { transaction } = event.data;

  if (transaction.status !== "APPROVED") {
    return NextResponse.json({ received: true });
  }

  // Update payment in database using service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      wompi_transaction_id: transaction.id,
      payment_ref: transaction.reference,
    })
    .eq("id", transaction.reference);

  if (error) {
    console.error("Failed to update payment:", error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
