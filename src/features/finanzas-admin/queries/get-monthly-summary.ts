"use server";

import { createClient } from "@/lib/supabase/server";

export interface MonthlySummaryItem {
  month: string; // "2026-04"
  label: string; // "Abr"
  income: number;
  expenses: number;
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

/**
 * Returns income vs expenses for the last 6 months.
 * Used in the admin dashboard bar chart.
 */
export async function getMonthlySummary(): Promise<MonthlySummaryItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return [];
  }

  const now = new Date();
  const months: { start: string; end: string; key: string; label: string }[] =
    [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const start = `${key}-01`;
    const end = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;
    months.push({ start, end, key, label: MONTH_LABELS[d.getMonth()] });
  }

  const rangeStart = months[0].start;
  const rangeEnd = months[months.length - 1].end;

  const [{ data: payments }, { data: expenses }] = await Promise.all([
    supabase
      .from("payments")
      .select("amount_cop, paid_at")
      .eq("status", "paid")
      .gte("paid_at", rangeStart)
      .lt("paid_at", rangeEnd),
    supabase
      .from("expenses")
      .select("amount_cop, paid_at")
      .eq("status", "paid")
      .gte("paid_at", rangeStart)
      .lt("paid_at", rangeEnd),
  ]);

  return months.map(({ start, end, key, label }) => {
    const monthIncome = (payments ?? [])
      .filter((p) => p.paid_at && p.paid_at >= start && p.paid_at < end)
      .reduce((sum, p) => sum + Number(p.amount_cop), 0);

    const monthExpenses = (expenses ?? [])
      .filter((e) => e.paid_at && e.paid_at >= start && e.paid_at < end)
      .reduce((sum, e) => sum + Number(e.amount_cop), 0);

    return { month: key, label, income: monthIncome, expenses: monthExpenses };
  });
}
