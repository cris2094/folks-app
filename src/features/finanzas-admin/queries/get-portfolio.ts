"use server";

import { createClient } from "@/lib/supabase/server";
import type { PortfolioUnit } from "@/types/database";

export interface PortfolioSummary {
  totalOverdue: number;
  overdueUnitsCount: number;
  aging: {
    overdue_0_30: number;
    overdue_31_60: number;
    overdue_61_90: number;
    overdue_90_plus: number;
  };
  units: PortfolioUnit[];
}

/**
 * Cartera morosa con aging buckets 30/60/90.
 * Usa la vista v_portfolio_summary para los calculos.
 */
export async function getPortfolio(): Promise<PortfolioSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalOverdue: 0,
      overdueUnitsCount: 0,
      aging: {
        overdue_0_30: 0,
        overdue_31_60: 0,
        overdue_61_90: 0,
        overdue_90_plus: 0,
      },
      units: [],
    };
  }

  // Verify admin role
  const { data: resident } = await supabase
    .from("residents")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return {
      totalOverdue: 0,
      overdueUnitsCount: 0,
      aging: {
        overdue_0_30: 0,
        overdue_31_60: 0,
        overdue_61_90: 0,
        overdue_90_plus: 0,
      },
      units: [],
    };
  }

  const { data: portfolioData } = await supabase
    .from("v_portfolio_summary")
    .select("*")
    .order("overdue_total", { ascending: false });

  const units = (portfolioData as unknown as PortfolioUnit[]) ?? [];

  // Aggregate aging buckets across all units
  const aging = units.reduce(
    (acc, u) => ({
      overdue_0_30: acc.overdue_0_30 + Number(u.overdue_0_30),
      overdue_31_60: acc.overdue_31_60 + Number(u.overdue_31_60),
      overdue_61_90: acc.overdue_61_90 + Number(u.overdue_61_90),
      overdue_90_plus: acc.overdue_90_plus + Number(u.overdue_90_plus),
    }),
    {
      overdue_0_30: 0,
      overdue_31_60: 0,
      overdue_61_90: 0,
      overdue_90_plus: 0,
    },
  );

  const totalOverdue = units.reduce(
    (sum, u) => sum + Number(u.overdue_total),
    0,
  );
  const overdueUnitsCount = units.filter(
    (u) => Number(u.overdue_total) > 0,
  ).length;

  return {
    totalOverdue,
    overdueUnitsCount,
    aging,
    units,
  };
}
