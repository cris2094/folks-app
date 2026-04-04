import { generateText } from "ai";
import { google } from "@/lib/ai/gemma";
import { getAnalyticsDashboard } from "@/features/analytics/queries/get-analytics-dashboard";
import { getAiSummary } from "@/features/analytics/queries/get-ai-summary";

export async function POST() {
  const dashboard = await getAnalyticsDashboard();

  // If no API key configured, return template-based summary
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const summary = await getAiSummary(dashboard);
    return Response.json({ summary });
  }

  try {
    const templateSummary = await getAiSummary(dashboard);

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `Eres un analista de datos para administracion de copropiedades en Colombia.
Genera un resumen ejecutivo mensual profesional, claro y accionable.
Usa lenguaje formal pero accesible. Escribe en espanol colombiano.
Organiza por secciones: Morosidad, PQR, Zonas Comunes, Adopcion.
Incluye recomendaciones concretas al final.
Maximo 300 palabras.`,
      prompt: `Genera un resumen ejecutivo basado en estos datos del dashboard:

${templateSummary}

Datos crudos adicionales:
- Unidades alto riesgo: ${dashboard.morosityRisk.highRisk}
- Unidades medio riesgo: ${dashboard.morosityRisk.mediumRisk}
- Unidades bajo riesgo: ${dashboard.morosityRisk.lowRisk}
- Top unidades en riesgo: ${dashboard.morosityRisk.predictions.slice(0, 5).map((p) => `${p.unitLabel} (${Math.round(p.probability * 100)}%)`).join(", ")}
- Categorias PQR: ${dashboard.pqrPatterns.byCategory.map((c) => `${c.category}: ${c.count} tickets, ${c.avgResolutionDays}d prom.`).join("; ")}
- Zonas: ${dashboard.zoneUsage.byZone.map((z) => `${z.name}: ${z.reservations} reservas`).join("; ")}
- Residentes: ${dashboard.generalMetrics.totalResidents}, activos: ${dashboard.generalMetrics.activeUsers}
- Adopcion: ${dashboard.generalMetrics.adoptionRate}%
- Satisfaccion: ${dashboard.generalMetrics.avgSatisfaction}/5`,
    });

    return Response.json({ summary: text });
  } catch {
    // Fallback to template-based summary on any AI error
    const summary = await getAiSummary(dashboard);
    return Response.json({ summary });
  }
}
