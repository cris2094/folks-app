"use server";

import { createClient } from "@/lib/supabase/server";

export interface MorosityPrediction {
  unitLabel: string;
  riskLevel: "high" | "medium" | "low";
  probability: number;
  lastLatePayment: string;
}

export interface MorosityRisk {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  predictions: MorosityPrediction[];
}

export interface PqrCategoryData {
  category: string;
  count: number;
  avgResolutionDays: number;
}

export interface PqrPatterns {
  byCategory: PqrCategoryData[];
  monthlyTrend: { month: string; count: number }[];
  topIssues: string[];
}

export interface ZoneUsageData {
  name: string;
  reservations: number;
  occupancyRate: number;
}

export interface ZoneUsage {
  byZone: ZoneUsageData[];
  peakHours: { hour: string; count: number }[];
}

export interface GeneralMetrics {
  totalResidents: number;
  activeUsers: number;
  adoptionRate: number;
  avgSatisfaction: number;
  activeUsersLast7Days: number | null;
  loginsLast7Days: number | null;
}

export interface AnalyticsDashboard {
  morosityRisk: MorosityRisk;
  pqrPatterns: PqrPatterns;
  zoneUsage: ZoneUsage;
  generalMetrics: GeneralMetrics;
}

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: "Mantenimiento",
  noise: "Ruido",
  security: "Seguridad",
  billing: "Facturacion",
  common_areas: "Areas comunes",
  parking: "Parqueadero",
  pets: "Mascotas",
  suggestion: "Sugerencia",
  other: "Otro",
};

function emptyDashboard(): AnalyticsDashboard {
  return {
    morosityRisk: { highRisk: 0, mediumRisk: 0, lowRisk: 0, predictions: [] },
    pqrPatterns: { byCategory: [], monthlyTrend: [], topIssues: [] },
    zoneUsage: { byZone: [], peakHours: [] },
    generalMetrics: {
      totalResidents: 0,
      activeUsers: 0,
      adoptionRate: 0,
      avgSatisfaction: 0,
      activeUsersLast7Days: null,
      loginsLast7Days: null,
    },
  };
}

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return emptyDashboard();

  // Verify admin role
  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return emptyDashboard();
  }

  const tenantId = resident.tenant_id;

  // Fetch all data in parallel
  const [
    { data: allPayments },
    { data: tickets },
    { data: reservations },
    { data: zones },
    { data: residents },
    { data: units },
  ] = await Promise.all([
    // All payments for morosity prediction (last 12 months)
    supabase
      .from("payments")
      .select("unit_id, status, due_date, paid_at, amount_cop")
      .eq("tenant_id", tenantId)
      .in("status", ["paid", "overdue", "pending"])
      .gte(
        "due_date",
        new Date(
          new Date().getFullYear() - 1,
          new Date().getMonth(),
          1,
        ).toISOString(),
      ),

    // All tickets for PQR patterns
    supabase
      .from("tickets")
      .select(
        "id, category, status, created_at, resolved_at, subject, rating",
      )
      .eq("tenant_id", tenantId),

    // All reservations for zone usage
    supabase
      .from("reservations")
      .select("zone_id, date, start_time, status")
      .eq("tenant_id", tenantId)
      .in("status", ["confirmed", "completed"]),

    // Zones for names
    supabase
      .from("zones")
      .select("id, name, max_reservations_per_month")
      .eq("tenant_id", tenantId)
      .eq("is_active", true),

    // Residents count
    supabase
      .from("residents")
      .select("id, user_id")
      .eq("tenant_id", tenantId)
      .eq("is_active", true),

    // Total units
    supabase.from("units").select("id, tower, apartment").eq("tenant_id", tenantId),
  ]);

  // =====================
  // MOROSITY PREDICTION
  // =====================
  const payments = allPayments ?? [];
  const unitPayments = new Map<
    string,
    { lateCount: number; totalCount: number; lastLate: string }
  >();

  for (const p of payments) {
    const entry = unitPayments.get(p.unit_id) ?? {
      lateCount: 0,
      totalCount: 0,
      lastLate: "",
    };
    entry.totalCount++;

    // A payment is "late" if it was paid after due_date or is overdue
    const isLate =
      p.status === "overdue" ||
      (p.status === "paid" &&
        p.paid_at &&
        new Date(p.paid_at) > new Date(p.due_date));

    if (isLate) {
      entry.lateCount++;
      const lateDate = p.paid_at ?? p.due_date;
      if (!entry.lastLate || lateDate > entry.lastLate) {
        entry.lastLate = lateDate;
      }
    }

    unitPayments.set(p.unit_id, entry);
  }

  // Build unit label map
  const unitMap = new Map<string, string>();
  for (const u of units ?? []) {
    unitMap.set(u.id, `${u.tower}-${u.apartment}`);
  }

  const predictions: MorosityPrediction[] = [];
  let highRisk = 0;
  let mediumRisk = 0;
  let lowRisk = 0;

  for (const [unitId, data] of unitPayments) {
    if (data.totalCount === 0) continue;
    const ratio = data.lateCount / data.totalCount;
    let riskLevel: "high" | "medium" | "low";
    let probability: number;

    if (data.lateCount >= 3 || ratio >= 0.5) {
      riskLevel = "high";
      probability = Math.min(0.95, 0.6 + ratio * 0.3);
      highRisk++;
    } else if (data.lateCount >= 2 || ratio >= 0.3) {
      riskLevel = "medium";
      probability = 0.3 + ratio * 0.3;
      mediumRisk++;
    } else {
      riskLevel = "low";
      probability = ratio * 0.3;
      lowRisk++;
    }

    predictions.push({
      unitLabel: unitMap.get(unitId) ?? unitId,
      riskLevel,
      probability: Math.round(probability * 100) / 100,
      lastLatePayment: data.lastLate || "N/A",
    });
  }

  // Sort by probability desc, show top 10 high/medium
  predictions.sort((a, b) => b.probability - a.probability);

  // =====================
  // PQR PATTERNS
  // =====================
  const ticketList = tickets ?? [];
  const categoryMap = new Map<
    string,
    { count: number; totalResolutionDays: number; resolvedCount: number }
  >();
  const monthMap = new Map<string, number>();

  for (const t of ticketList) {
    // By category
    const cat = CATEGORY_LABELS[t.category] ?? t.category;
    const entry = categoryMap.get(cat) ?? {
      count: 0,
      totalResolutionDays: 0,
      resolvedCount: 0,
    };
    entry.count++;

    if (t.resolved_at && t.created_at) {
      const days =
        (new Date(t.resolved_at).getTime() -
          new Date(t.created_at).getTime()) /
        (1000 * 60 * 60 * 24);
      entry.totalResolutionDays += days;
      entry.resolvedCount++;
    }
    categoryMap.set(cat, entry);

    // Monthly trend
    const month = t.created_at.substring(0, 7); // YYYY-MM
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      avgResolutionDays:
        data.resolvedCount > 0
          ? Math.round(data.totalResolutionDays / data.resolvedCount)
          : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const monthlyTrend = Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  // Top issues: most common subjects (simple frequency)
  const subjectFreq = new Map<string, number>();
  for (const t of ticketList) {
    const key = t.subject.toLowerCase().trim();
    subjectFreq.set(key, (subjectFreq.get(key) ?? 0) + 1);
  }
  const topIssues = Array.from(subjectFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([subject]) => subject);

  // =====================
  // ZONE USAGE
  // =====================
  const reservationList = reservations ?? [];
  const zoneList = zones ?? [];
  const zoneNameMap = new Map<string, string>();
  const zoneCapMap = new Map<string, number>();
  for (const z of zoneList) {
    zoneNameMap.set(z.id, z.name);
    zoneCapMap.set(z.id, z.max_reservations_per_month);
  }

  const zoneCountMap = new Map<string, number>();
  const hourCountMap = new Map<string, number>();

  for (const r of reservationList) {
    zoneCountMap.set(r.zone_id, (zoneCountMap.get(r.zone_id) ?? 0) + 1);

    // Peak hours
    if (r.start_time) {
      const hour = r.start_time.substring(0, 2) + ":00";
      hourCountMap.set(hour, (hourCountMap.get(hour) ?? 0) + 1);
    }
  }

  // Calculate months of data for occupancy rate
  const monthsOfData = Math.max(1, monthlyTrend.length || 1);

  const byZone = Array.from(zoneCountMap.entries())
    .map(([zoneId, count]) => {
      const cap = zoneCapMap.get(zoneId) ?? 30;
      const monthlyAvg = count / monthsOfData;
      return {
        name: zoneNameMap.get(zoneId) ?? zoneId,
        reservations: count,
        occupancyRate: Math.min(
          100,
          Math.round((monthlyAvg / cap) * 100),
        ),
      };
    })
    .sort((a, b) => b.reservations - a.reservations);

  const peakHours = Array.from(hourCountMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // =====================
  // GENERAL METRICS
  // =====================
  const residentList = residents ?? [];
  const totalResidents = residentList.length;
  const activeUsers = residentList.filter((r) => r.user_id !== null).length;
  const adoptionRate =
    totalResidents > 0
      ? Math.round((activeUsers / totalResidents) * 100)
      : 0;

  // NPS estimated from ticket ratings
  const ratedTickets = ticketList.filter(
    (t) => t.rating !== null && t.rating !== undefined,
  );
  const avgSatisfaction =
    ratedTickets.length > 0
      ? Math.round(
          (ratedTickets.reduce((sum, t) => sum + (t.rating ?? 0), 0) /
            ratedTickets.length) *
            10,
        ) / 10
      : 0;

  return {
    morosityRisk: {
      highRisk,
      mediumRisk,
      lowRisk,
      predictions: predictions.filter((p) => p.riskLevel !== "low").slice(0, 15),
    },
    pqrPatterns: {
      byCategory,
      monthlyTrend,
      topIssues,
    },
    zoneUsage: {
      byZone,
      peakHours,
    },
    generalMetrics: {
      totalResidents,
      activeUsers,
      adoptionRate,
      avgSatisfaction,
      // Mock data — will be replaced with real auth session tracking
      activeUsersLast7Days: Math.round(activeUsers * 0.6),
      loginsLast7Days: Math.round(activeUsers * 2.3),
    },
  };
}
