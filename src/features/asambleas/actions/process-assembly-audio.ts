"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CommitmentExtract {
  title: string;
  description: string;
  responsible: string;
  due_date: string | null;
}

/**
 * Pipeline IA para asambleas:
 * 1. Transcribe audio con Whisper
 * 2. Genera acta Ley 675 con Claude
 * 3. Extrae compromisos con Claude
 */
export async function processAssemblyAudio(assemblyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Verify admin
  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (
    !resident ||
    !["admin", "super_admin"].includes(resident.role)
  ) {
    return { error: "Solo administradores pueden procesar asambleas" };
  }

  // Get assembly
  const { data: assembly } = await supabase
    .from("assemblies")
    .select("*")
    .eq("id", assemblyId)
    .single();

  if (!assembly) return { error: "Asamblea no encontrada" };

  // ── Step 1: Transcription ──────────────────────────
  await supabase
    .from("assemblies")
    .update({ status: "transcribing", updated_at: new Date().toISOString() })
    .eq("id", assemblyId);

  let transcript: string;

  if (process.env.OPENAI_API_KEY && assembly.audio_url) {
    try {
      transcript = await transcribeWithWhisper(assembly.audio_url);
    } catch (err) {
      console.error("Whisper error:", err);
      transcript = getPlaceholderTranscript();
    }
  } else {
    transcript = getPlaceholderTranscript();
  }

  await supabase
    .from("assemblies")
    .update({ transcript, updated_at: new Date().toISOString() })
    .eq("id", assemblyId);

  // ── Step 2: Generate minutes (acta) ────────────────
  await supabase
    .from("assemblies")
    .update({ status: "generating", updated_at: new Date().toISOString() })
    .eq("id", assemblyId);

  let minutesHtml: string;

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      minutesHtml = await generateMinutesWithClaude(transcript, assembly);
    } catch (err) {
      console.error("Claude minutes error:", err);
      minutesHtml = getPlaceholderMinutes(assembly);
    }
  } else {
    minutesHtml = getPlaceholderMinutes(assembly);
  }

  await supabase
    .from("assemblies")
    .update({ minutes_html: minutesHtml, updated_at: new Date().toISOString() })
    .eq("id", assemblyId);

  // ── Step 3: Extract commitments ────────────────────
  let commitments: CommitmentExtract[] = [];

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      commitments = await extractCommitmentsWithClaude(transcript);
    } catch (err) {
      console.error("Claude commitments error:", err);
      commitments = getPlaceholderCommitments();
    }
  } else {
    commitments = getPlaceholderCommitments();
  }

  // Insert commitments
  if (commitments.length > 0) {
    const rows = commitments.map((c) => ({
      assembly_id: assemblyId,
      tenant_id: resident.tenant_id,
      title: c.title,
      description: c.description,
      responsible: c.responsible,
      due_date: c.due_date,
      status: "pending" as const,
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await supabase.from("commitments").insert(rows);
  }

  // ── Step 4: Move to review ─────────────────────────
  await supabase
    .from("assemblies")
    .update({ status: "review", updated_at: new Date().toISOString() })
    .eq("id", assemblyId);

  revalidatePath(`/admin/asambleas/${assemblyId}`);
  return { success: true };
}

// ─── Whisper transcription ──────────────────────────────

async function transcribeWithWhisper(audioUrl: string): Promise<string> {
  // Download audio file
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) throw new Error("Failed to download audio");

  const audioBlob = await audioResponse.blob();
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.mp3");
  formData.append("model", "whisper-1");
  formData.append("language", "es");
  formData.append("response_format", "text");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
  }

  return response.text();
}

// ─── Claude: Generate minutes ───────────────────────────

async function generateMinutesWithClaude(
  transcript: string,
  assembly: Record<string, unknown>,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;

  const systemPrompt = `Eres un asistente legal especializado en propiedad horizontal colombiana.
Genera actas formales de asamblea cumpliendo con la Ley 675 de 2001, Articulo 47.

FORMATO REQUERIDO: HTML valido para renderizar en una aplicacion web.
Usa etiquetas semanticas: <h2>, <h3>, <p>, <ul>, <li>, <table>, <strong>.
NO uses <html>, <head>, <body>. Solo el contenido del acta.

ESTRUCTURA DEL ACTA:
1. Encabezado: Nombre del conjunto, tipo de asamblea, fecha, lugar
2. Verificacion de Quorum: Unidades presentes, coeficiente, quorum requerido
3. Designacion de presidente y secretario de la asamblea
4. Orden del dia (puntos a tratar)
5. Deliberaciones y discusiones por cada punto
6. Votaciones realizadas (a favor, en contra, abstenciones)
7. Compromisos adquiridos con responsables y fechas
8. Proposiciones y varios
9. Cierre y firma

Idioma: Espanol colombiano formal.`;

  const userPrompt = `Genera el acta formal de esta asamblea basandote en la transcripcion.

DATOS DE LA ASAMBLEA:
- Titulo: ${assembly.title ?? "Asamblea"}
- Tipo: ${assembly.type === "ordinary" ? "Ordinaria" : "Extraordinaria"}
- Fecha: ${assembly.date ?? "No especificada"}
- Lugar: ${assembly.location ?? "No especificado"}
- Presidente: ${assembly.president ?? "No designado"}
- Secretario: ${assembly.secretary ?? "No designado"}
- Quorum presente: ${assembly.quorum_present ?? "N/A"}%
- Quorum requerido: ${assembly.quorum_required ?? "N/A"}%

TRANSCRIPCION:
${transcript}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.content?.[0]?.text as string) ?? "";
}

// ─── Claude: Extract commitments ────────────────────────

async function extractCommitmentsWithClaude(
  transcript: string,
): Promise<CommitmentExtract[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY!;

  const systemPrompt = `Extrae los compromisos de una asamblea de propiedad horizontal.
Responde UNICAMENTE con un JSON array. Sin texto adicional.
Cada compromiso debe tener: title, description, responsible, due_date (YYYY-MM-DD o null).

Ejemplo:
[{"title":"Reparar ascensor","description":"Contratar tecnico para revision del ascensor torre 2","responsible":"Administracion","due_date":"2025-03-15"}]`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Extrae los compromisos de esta transcripcion de asamblea:\n\n${transcript}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = (data.content?.[0]?.text as string) ?? "[]";

  // Extract JSON from possible markdown code block
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]) as CommitmentExtract[];
  } catch {
    console.error("Failed to parse commitments JSON:", text);
    return [];
  }
}

// ─── Placeholders ───────────────────────────────────────

function getPlaceholderTranscript(): string {
  return `[Transcripcion de ejemplo - API de Whisper no configurada]

Presidente: Buenos dias a todos. Damos inicio a la asamblea ordinaria de copropietarios.
Verificamos quorum: tenemos presentes propietarios representando el 65% de los coeficientes.

Punto 1 - Informe de gestion: La administracion presenta el informe de gestion del periodo.
Se ejecutaron obras de mantenimiento en zonas comunes, pintura de fachada y reparacion del sistema de bombeo.

Punto 2 - Estados financieros: Se presentan los estados financieros del periodo.
Ingresos totales: $45.000.000. Gastos totales: $38.000.000. Saldo a favor: $7.000.000.
La cartera morosa asciende a $12.500.000 correspondiente a 8 unidades.

Punto 3 - Presupuesto siguiente periodo: Se aprueba presupuesto por $52.000.000.
Se incluye provision para impermeabilizacion de cubiertas por $8.000.000.

Punto 4 - Eleccion del consejo: Se propone renovacion del consejo de administracion.
Se eligen 5 miembros principales y 3 suplentes.

Compromisos:
- Administracion debe presentar cotizaciones de impermeabilizacion antes del 15 de abril.
- El consejo debe reunirse en los proximos 15 dias para elegir presidente.
- Administracion debe enviar circular sobre normas de parqueadero.

Se cierra la asamblea a las 11:30 AM.`;
}

function getPlaceholderMinutes(
  assembly: Record<string, unknown>,
): string {
  const title = (assembly.title as string) ?? "Asamblea General";
  const date = assembly.date
    ? new Date(assembly.date as string).toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Fecha no especificada";

  return `<h2>ACTA DE ${title.toUpperCase()}</h2>
<h3>Ley 675 de 2001 - Articulo 47</h3>

<p><strong>Fecha:</strong> ${date}</p>
<p><strong>Lugar:</strong> ${(assembly.location as string) ?? "Salon comunal del conjunto"}</p>
<p><strong>Tipo:</strong> Asamblea ${assembly.type === "ordinary" ? "Ordinaria" : "Extraordinaria"}</p>
<p><strong>Presidente de la asamblea:</strong> ${(assembly.president as string) ?? "Por designar"}</p>
<p><strong>Secretario de la asamblea:</strong> ${(assembly.secretary as string) ?? "Por designar"}</p>

<h3>1. Verificacion de Quorum</h3>
<p>Se verifica la asistencia de propietarios que representan el <strong>${assembly.quorum_present ?? "N/A"}%</strong> de los coeficientes de copropiedad, superando el quorum requerido del ${assembly.quorum_required ?? "N/A"}%.</p>

<h3>2. Orden del Dia</h3>
<ul>
  <li>Informe de gestion de la administracion</li>
  <li>Presentacion y aprobacion de estados financieros</li>
  <li>Aprobacion del presupuesto para el siguiente periodo</li>
  <li>Eleccion del consejo de administracion</li>
  <li>Proposiciones y varios</li>
</ul>

<h3>3. Informe de Gestion</h3>
<p>La administracion presenta el informe de gestion del periodo, destacando las obras de mantenimiento realizadas en zonas comunes, incluyendo pintura de fachada y reparacion del sistema de bombeo.</p>

<h3>4. Estados Financieros</h3>
<table style="width:100%; border-collapse:collapse; margin:8px 0;">
  <tr style="background:#f9fafb;"><td style="padding:6px 8px; border:1px solid #e5e7eb;"><strong>Ingresos</strong></td><td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:right;">$45.000.000</td></tr>
  <tr><td style="padding:6px 8px; border:1px solid #e5e7eb;"><strong>Gastos</strong></td><td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:right;">$38.000.000</td></tr>
  <tr style="background:#f0fdf4;"><td style="padding:6px 8px; border:1px solid #e5e7eb;"><strong>Saldo</strong></td><td style="padding:6px 8px; border:1px solid #e5e7eb; text-align:right;">$7.000.000</td></tr>
</table>
<p>La cartera morosa asciende a $12.500.000 correspondiente a 8 unidades.</p>

<h3>5. Presupuesto Siguiente Periodo</h3>
<p>Se aprueba por mayoria el presupuesto por valor de $52.000.000, incluyendo provision para impermeabilizacion de cubiertas por $8.000.000.</p>

<h3>6. Eleccion del Consejo de Administracion</h3>
<p>Se procede a la eleccion del consejo, resultando elegidos 5 miembros principales y 3 suplentes.</p>

<h3>7. Compromisos</h3>
<ul>
  <li><strong>Administracion:</strong> Presentar cotizaciones de impermeabilizacion antes del 15 de abril.</li>
  <li><strong>Consejo:</strong> Reunirse en los proximos 15 dias para elegir presidente del consejo.</li>
  <li><strong>Administracion:</strong> Enviar circular sobre normas de parqueadero.</li>
</ul>

<h3>8. Cierre</h3>
<p>No habiendo mas asuntos que tratar, se da por terminada la asamblea. Se firma la presente acta por el presidente y el secretario de la asamblea.</p>

<p style="margin-top:24px;"><em>Nota: Esta acta fue generada como ejemplo. Configure las API keys de OpenAI y Anthropic para generacion real basada en audio.</em></p>`;
}

function getPlaceholderCommitments(): CommitmentExtract[] {
  return [
    {
      title: "Cotizaciones impermeabilizacion",
      description:
        "Presentar al menos 3 cotizaciones para la impermeabilizacion de cubiertas",
      responsible: "Administracion",
      due_date: null,
    },
    {
      title: "Reunion del consejo",
      description:
        "El consejo de administracion debe reunirse para elegir presidente",
      responsible: "Consejo de Administracion",
      due_date: null,
    },
    {
      title: "Circular normas parqueadero",
      description:
        "Enviar circular a todos los residentes recordando las normas de uso de parqueaderos",
      responsible: "Administracion",
      due_date: null,
    },
  ];
}
