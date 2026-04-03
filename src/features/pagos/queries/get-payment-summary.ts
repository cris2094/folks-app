"use server";

import { createClient } from "@/lib/supabase/server";

export interface PaymentSummary {
  totalPending: number;
  totalOverdue: number;
  countPending: number;
  countOverdue: number;
  lastPaymentDate: string | null;
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalPending: 0, totalOverdue: 0, countPending: 0, countOverdue: 0, lastPaymentDate: null };

  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) {
    return { totalPending: 0, totalOverdue: 0, countPending: 0, countOverdue: 0, lastPaymentDate: null };
  }

  const unitIds = residents.map((r) => r.unit_id);

  const [{ data: pending }, { data: overdue }, { data: lastPaid }] = await Promise.all([
    supabase
      .from("payments")
      .select("amount_cop, late_fee_cop")
      .in("unit_id", unitIds)
      .eq("status", "pending"),
    supabase
      .from("payments")
      .select("amount_cop, late_fee_cop")
      .in("unit_id", unitIds)
      .eq("status", "overdue"),
    supabase
      .from("payments")
      .select("paid_at")
      .in("unit_id", unitIds)
      .eq("status", "paid")
      .order("paid_at", { ascending: false })
      .limit(1),
  ]);

  const sumAmount = (items: { amount_cop: number; late_fee_cop: number }[] | null) =>
    (items ?? []).reduce((sum, p) => sum + Number(p.amount_cop) + Number(p.late_fee_cop), 0);

  return {
    totalPending: sumAmount(pending),
    totalOverdue: sumAmount(overdue),
    countPending: pending?.length ?? 0,
    countOverdue: overdue?.length ?? 0,
    lastPaymentDate: lastPaid?.[0]?.paid_at ?? null,
  };
}
