"use server";

import type { AnalyticsDashboard } from "./get-analytics-dashboard";

/**
 * Genera un resumen ejecutivo mensual basado en los datos del dashboard.
 * Usa templates inteligentes con los datos reales.
 * La version con IA se invoca via API route /api/ai/summary.
 */
export async function getAiSummary(
  data: AnalyticsDashboard,
): Promise<string> {
  const { morosityRisk, pqrPatterns, zoneUsage, generalMetrics } = data;

  const totalUnits =
    morosityRisk.highRisk + morosityRisk.mediumRisk + morosityRisk.lowRisk;
  const totalPqr = pqrPatterns.byCategory.reduce((s, c) => s + c.count, 0);
  const topCategory = pqrPatterns.byCategory[0];
  const topZone = zoneUsage.byZone[0];

  const lines: string[] = [];

  lines.push("RESUMEN EJECUTIVO - " + new Date().toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  }).toUpperCase());

  lines.push("");

  // Morosity
  if (morosityRisk.highRisk > 0) {
    const pct = totalUnits > 0 ? Math.round((morosityRisk.highRisk / totalUnits) * 100) : 0;
    lines.push(
      `MOROSIDAD: ${morosityRisk.highRisk} unidades en riesgo alto (${pct}% del total). ` +
      `${morosityRisk.mediumRisk} en riesgo medio. Se recomienda gestion preventiva inmediata.`,
    );
  } else {
    lines.push(
      "MOROSIDAD: Sin unidades en riesgo alto. Buen comportamiento de pago en general.",
    );
  }

  lines.push("");

  // PQR
  if (totalPqr > 0) {
    lines.push(
      `PQR: ${totalPqr} tickets registrados. ` +
      (topCategory
        ? `La categoria mas frecuente es "${topCategory.category}" con ${topCategory.count} casos ` +
          `(tiempo promedio de resolucion: ${topCategory.avgResolutionDays} dias). `
        : "") +
      (pqrPatterns.topIssues.length > 0
        ? `Temas recurrentes: ${pqrPatterns.topIssues.slice(0, 3).join(", ")}.`
        : ""),
    );
  } else {
    lines.push("PQR: No se registran tickets en el periodo analizado.");
  }

  lines.push("");

  // Zones
  if (topZone) {
    lines.push(
      `ZONAS COMUNES: La zona mas utilizada es "${topZone.name}" con ${topZone.reservations} reservas ` +
      `(${topZone.occupancyRate}% de ocupacion). ` +
      (zoneUsage.peakHours.length > 0
        ? `Hora pico: ${zoneUsage.peakHours.sort((a, b) => b.count - a.count)[0].hour}.`
        : ""),
    );
  } else {
    lines.push("ZONAS COMUNES: Sin reservas registradas en el periodo.");
  }

  lines.push("");

  // General
  lines.push(
    `ADOPCION: ${generalMetrics.activeUsers} de ${generalMetrics.totalResidents} residentes usan la app ` +
    `(${generalMetrics.adoptionRate}% de adopcion). ` +
    (generalMetrics.avgSatisfaction > 0
      ? `Satisfaccion promedio: ${generalMetrics.avgSatisfaction}/5.`
      : "Sin calificaciones de satisfaccion aun."),
  );

  return lines.join("\n");
}
