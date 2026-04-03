"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

interface FolkyContext {
  residentName: string | null;
  tenantName: string | null;
  unitInfo: string | null;
  role: string | null;
}

async function getResidentContext(phone: string): Promise<FolkyContext> {
  // Normalize phone: remove '+' prefix, ensure country code
  const normalizedPhone = phone.replace(/^\+/, "");

  const { data: resident } = await getSupabase()
    .from("residents")
    .select(`
      full_name, role,
      unit:units (tower, apartment),
      tenant:tenants (name)
    `)
    .or(`phone.eq.${normalizedPhone},phone.eq.+${normalizedPhone}`)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) {
    return { residentName: null, tenantName: null, unitInfo: null, role: null };
  }

  const unit = Array.isArray(resident.unit) ? resident.unit[0] : resident.unit;
  const tenant = Array.isArray(resident.tenant)
    ? resident.tenant[0]
    : resident.tenant;

  return {
    residentName: resident.full_name as string,
    tenantName:
      ((tenant as Record<string, unknown>)?.name as string) ?? null,
    unitInfo: unit
      ? `${(unit as Record<string, unknown>).tower} Apto ${(unit as Record<string, unknown>).apartment}`
      : null,
    role: resident.role as string,
  };
}

async function generateAIResponse(
  userMessage: string,
  context: FolkyContext,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Lo siento, el servicio de IA no esta disponible en este momento.";
  }

  const systemPrompt = `Eres Folky, el asistente virtual del conjunto residencial${context.tenantName ? ` "${context.tenantName}"` : ""}.
Eres amable, respetuoso (tratas de "usted"), eficiente y con un toque de humor sutil colombiano.
Respondes en espanol colombiano.

${context.residentName ? `Estas hablando con ${context.residentName}` : "Estas hablando con un residente"}${context.unitInfo ? ` de ${context.unitInfo}` : ""}.
${context.role ? `Su rol es: ${context.role}` : ""}

Tus capacidades:
- Responder preguntas sobre el conjunto (horarios de zonas, reglamento, contactos)
- Informar sobre pagos pendientes, paquetes, reservas
- Ayudar a reservar zonas sociales
- Recibir quejas y sugerencias (las registras como PQR)
- Informar sobre visitantes

Si no sabes algo, di honestamente que no tienes esa informacion y sugiere contactar a la administracion.
Manten las respuestas cortas (maximo 3-4 oraciones) a menos que te pidan mas detalle.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", response.status);
      return "Disculpe, tuve un problema procesando su mensaje. Intente de nuevo.";
    }

    const data = await response.json();
    return (
      (data.content?.[0]?.text as string) ?? "No pude generar una respuesta."
    );
  } catch (error) {
    console.error("Claude API exception:", error);
    return "Disculpe, tuve un error. Intente de nuevo en unos minutos.";
  }
}

async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error("WhatsApp credentials not configured");
    return;
  }

  try {
    await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      },
    );
  } catch (error) {
    console.error("WhatsApp send error:", error);
  }
}

export async function processWhatsAppMessage(
  from: string,
  text: string,
): Promise<void> {
  // 1. Get resident context from database
  const context = await getResidentContext(from);

  // 2. Generate AI response with context
  const response = await generateAIResponse(text, context);

  // 3. Send response back via WhatsApp
  await sendWhatsAppMessage(from, response);
}
