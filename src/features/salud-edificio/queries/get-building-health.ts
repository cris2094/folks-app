"use server";

import { createClient } from "@/lib/supabase/server";

export interface HealthDimension {
  name: string;
  score: number;
  status: "green" | "yellow" | "red";
  details: string;
  recommendations: string[];
}

export interface BuildingHealth {
  overallScore: number;
  status: "green" | "yellow" | "red";
  dimensions: HealthDimension[];
  lastUpdated: string;
}

function getStatus(score: number): "green" | "yellow" | "red" {
  if (score > 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

/**
 * Calcula el score de salud del edificio basado en 4 dimensiones:
 * - Financiero (25%): recaudo, cartera morosa, fondo de reserva
 * - Mantenimiento (25%): tickets abiertos vs resueltos, tiempo resolucion
 * - Regulatorio (25%): asambleas realizadas, actas publicadas
 * - Convivencia (25%): PQR abiertos, tasa resolucion, rating promedio
 */
export async function getBuildingHealth(): Promise<BuildingHealth> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return defaultHealth();
  }

  const now = new Date();
  const yearStart = `${now.getFullYear()}-01-01`;
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    { data: paidMonth },
    { data: allMonth },
    { data: overduePayments },
    { data: reserveMovements },
    { data: allTickets },
    { data: assemblies },
    { data: pqrTickets },
  ] = await Promise.all([
    // Pagos pagados este mes
    supabase
      .from("payments")
      .select("amount_cop")
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", monthEnd),
    // Todos los pagos del mes
    supabase
      .from("payments")
      .select("amount_cop, status")
      .gte("due_date", monthStart)
      .lt("due_date", monthEnd),
    // Cartera morosa
    supabase
      .from("payments")
      .select("amount_cop")
      .eq("status", "overdue"),
    // Fondo de reserva
    supabase
      .from("reserve_fund_movements")
      .select("type, amount_cop"),
    // Tickets de mantenimiento
    supabase
      .from("tickets")
      .select("id, status, category, created_at, resolved_at")
      .eq("category", "maintenance"),
    // Asambleas del ano
    supabase
      .from("assemblies")
      .select("id, status")
      .gte("date", yearStart),
    // PQR (todos los tickets)
    supabase
      .from("tickets")
      .select("id, status, rating, created_at, resolved_at"),
  ]);

  // ========== FINANCIERO (25%) ==========
  const financialScore = calcFinancial(
    paidMonth ?? [],
    allMonth ?? [],
    overduePayments ?? [],
    reserveMovements ?? [],
  );

  // ========== MANTENIMIENTO (25%) ==========
  const maintenanceScore = calcMaintenance(allTickets ?? []);

  // ========== REGULATORIO (25%) ==========
  const regulatoryScore = calcRegulatory(assemblies ?? []);

  // ========== CONVIVENCIA (25%) ==========
  const coexistenceScore = calcCoexistence(pqrTickets ?? []);

  const dimensions = [financialScore, maintenanceScore, regulatoryScore, coexistenceScore];
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  );

  return {
    overallScore,
    status: getStatus(overallScore),
    dimensions,
    lastUpdated: new Date().toISOString(),
  };
}

// ── Financiero ──────────────────────────────────────────────
function calcFinancial(
  paidMonth: { amount_cop: number }[],
  allMonth: { amount_cop: number; status: string }[],
  overduePayments: { amount_cop: number }[],
  reserveMovements: { type: string; amount_cop: number }[],
): HealthDimension {
  if (allMonth.length === 0) {
    return {
      name: "Financiero",
      score: 50,
      status: "yellow",
      details: "Datos insuficientes para calcular el score financiero",
      recommendations: ["Registrar pagos y egresos del periodo actual"],
    };
  }

  const totalDue = allMonth.reduce((s, p) => s + Number(p.amount_cop), 0);
  const totalPaid = paidMonth.reduce((s, p) => s + Number(p.amount_cop), 0);
  const collectionRate = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;

  const totalOverdue = overduePayments.reduce((s, p) => s + Number(p.amount_cop), 0);
  const reserveBalance = reserveMovements.reduce((s, m) => {
    const amount = Number(m.amount_cop);
    return m.type === "income" ? s + amount : s - amount;
  }, 0);

  // Score: 50% collection rate, 30% low overdue, 20% positive reserve
  let score = 0;
  score += Math.min(collectionRate, 100) * 0.5;
  score += (totalOverdue === 0 ? 100 : Math.max(0, 100 - (totalOverdue / Math.max(totalDue, 1)) * 100)) * 0.3;
  score += (reserveBalance > 0 ? Math.min(100, 50 + (reserveBalance / Math.max(totalDue, 1)) * 50) : 20) * 0.2;
  score = Math.round(Math.min(100, Math.max(0, score)));

  const recommendations: string[] = [];
  if (collectionRate < 80) recommendations.push("Mejorar tasa de recaudo - actualmente al " + Math.round(collectionRate) + "%");
  if (totalOverdue > 0) recommendations.push("Reducir cartera morosa de $" + totalOverdue.toLocaleString("es-CO"));
  if (reserveBalance <= 0) recommendations.push("Fortalecer el fondo de reserva");

  return {
    name: "Financiero",
    score,
    status: getStatus(score),
    details: `Recaudo: ${Math.round(collectionRate)}% | Moroso: $${totalOverdue.toLocaleString("es-CO")}`,
    recommendations,
  };
}

// ── Mantenimiento ───────────────────────────────────────────
function calcMaintenance(
  tickets: { id: string; status: string; created_at: string; resolved_at: string | null }[],
): HealthDimension {
  if (tickets.length === 0) {
    return {
      name: "Mantenimiento",
      score: 75,
      status: "green",
      details: "Sin tickets de mantenimiento registrados",
      recommendations: ["Registrar solicitudes de mantenimiento para seguimiento"],
    };
  }

  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "rated");
  const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const resolutionRate = (resolved.length / tickets.length) * 100;

  // Avg resolution time in hours
  const resolvedWithTime = resolved.filter((t) => t.resolved_at);
  let avgHours = 0;
  if (resolvedWithTime.length > 0) {
    const totalHours = resolvedWithTime.reduce((sum, t) => {
      return sum + (new Date(t.resolved_at!).getTime() - new Date(t.created_at).getTime()) / (1000 * 60 * 60);
    }, 0);
    avgHours = totalHours / resolvedWithTime.length;
  }

  // Score: 60% resolution rate, 40% speed (lower is better)
  let score = 0;
  score += resolutionRate * 0.6;
  // Time score: <24h = 100, <72h = 80, <168h = 50, >168h = 20
  const timeScore = avgHours === 0 ? 80 : avgHours < 24 ? 100 : avgHours < 72 ? 80 : avgHours < 168 ? 50 : 20;
  score += timeScore * 0.4;
  score = Math.round(Math.min(100, Math.max(0, score)));

  const recommendations: string[] = [];
  if (open.length > 3) recommendations.push(`${open.length} tickets de mantenimiento abiertos - priorizar resolucion`);
  if (avgHours > 72) recommendations.push("Tiempo promedio de resolucion alto (" + Math.round(avgHours) + "h) - revisar procesos");
  if (resolutionRate < 70) recommendations.push("Tasa de resolucion al " + Math.round(resolutionRate) + "% - mejorar seguimiento");

  return {
    name: "Mantenimiento",
    score,
    status: getStatus(score),
    details: `Resueltos: ${resolved.length}/${tickets.length} | Tiempo prom: ${Math.round(avgHours)}h`,
    recommendations,
  };
}

// ── Regulatorio ─────────────────────────────────────────────
function calcRegulatory(
  assemblies: { id: string; status: string }[],
): HealthDimension {
  if (assemblies.length === 0) {
    return {
      name: "Regulatorio",
      score: 40,
      status: "yellow",
      details: "Sin asambleas registradas este ano",
      recommendations: [
        "Programar asamblea ordinaria anual",
        "Publicar actas de asambleas anteriores",
      ],
    };
  }

  const published = assemblies.filter((a) => a.status === "published");
  const publicationRate = (published.length / assemblies.length) * 100;

  // Min 1 assembly per year required by law, 2+ is ideal
  const assemblyCountScore = assemblies.length >= 2 ? 100 : assemblies.length === 1 ? 70 : 30;
  // Publication rate
  const publicationScore = publicationRate;

  // 50% assembly count, 50% publication rate
  let score = Math.round((assemblyCountScore * 0.5 + publicationScore * 0.5));
  score = Math.min(100, Math.max(0, score));

  const recommendations: string[] = [];
  if (assemblies.length < 2) recommendations.push("Realizar al menos 2 asambleas al ano (1 ordinaria + 1 extraordinaria)");
  if (publicationRate < 100) recommendations.push(`${assemblies.length - published.length} acta(s) pendientes de publicar`);

  return {
    name: "Regulatorio",
    score,
    status: getStatus(score),
    details: `Asambleas: ${assemblies.length} | Publicadas: ${published.length}`,
    recommendations,
  };
}

// ── Convivencia ─────────────────────────────────────────────
function calcCoexistence(
  tickets: { id: string; status: string; rating: number | null; created_at: string; resolved_at: string | null }[],
): HealthDimension {
  if (tickets.length === 0) {
    return {
      name: "Convivencia",
      score: 80,
      status: "green",
      details: "Sin PQR registrados - buena senal",
      recommendations: ["Habilitar canal de PQR para residentes"],
    };
  }

  const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "rated");
  const resolutionRate = (resolved.length / tickets.length) * 100;

  // Average rating (1-5)
  const rated = tickets.filter((t) => t.rating != null);
  const avgRating = rated.length > 0
    ? rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length
    : 3; // default neutral

  // Score: 40% resolution rate, 30% low open count, 30% rating
  let score = 0;
  score += resolutionRate * 0.4;
  // Open PQR penalty: 0 = 100, 1-3 = 80, 4-7 = 50, 8+ = 20
  const openScore = open.length === 0 ? 100 : open.length <= 3 ? 80 : open.length <= 7 ? 50 : 20;
  score += openScore * 0.3;
  // Rating: scale 1-5 -> 0-100
  score += ((avgRating - 1) / 4) * 100 * 0.3;
  score = Math.round(Math.min(100, Math.max(0, score)));

  const recommendations: string[] = [];
  if (open.length > 5) recommendations.push(`${open.length} PQR abiertos - agilizar respuestas`);
  if (resolutionRate < 70) recommendations.push("Tasa de resolucion de PQR al " + Math.round(resolutionRate) + "%");
  if (avgRating < 3.5 && rated.length > 0) recommendations.push("Satisfaccion promedio baja (" + avgRating.toFixed(1) + "/5) - revisar calidad de respuestas");

  return {
    name: "Convivencia",
    score,
    status: getStatus(score),
    details: `Abiertos: ${open.length} | Resolucion: ${Math.round(resolutionRate)}% | Rating: ${avgRating.toFixed(1)}/5`,
    recommendations,
  };
}

// ── Default cuando no hay sesion ────────────────────────────
function defaultHealth(): BuildingHealth {
  return {
    overallScore: 0,
    status: "red",
    dimensions: [
      { name: "Financiero", score: 0, status: "red", details: "Sin datos", recommendations: [] },
      { name: "Mantenimiento", score: 0, status: "red", details: "Sin datos", recommendations: [] },
      { name: "Regulatorio", score: 0, status: "red", details: "Sin datos", recommendations: [] },
      { name: "Convivencia", score: 0, status: "red", details: "Sin datos", recommendations: [] },
    ],
    lastUpdated: new Date().toISOString(),
  };
}
