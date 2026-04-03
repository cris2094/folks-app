"use server";

import { createClient } from "@/lib/supabase/server";
import type { FinancialSummary } from "@/types/database";

/**
 * Resumen financiero del conjunto:
 * - Total ingresos (pagos recibidos) del mes actual
 * - Total egresos (gastos pagados) del mes actual
 * - Balance (ingresos - egresos)
 * - Tasa de recaudo (%)
 * - Cartera morosa total
 * - Cantidad de unidades morosas
 * - Saldo fondo de reserva
 */
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      collectionRate: 0,
      totalOverdue: 0,
      overdueUnitsCount: 0,
      reserveFundBalance: 0,
    };
  }

  // Verify admin role
  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      collectionRate: 0,
      totalOverdue: 0,
      overdueUnitsCount: 0,
      reserveFundBalance: 0,
    };
  }

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    { data: paidPayments },
    { data: allPaymentsMonth },
    { data: paidExpenses },
    { data: overduePayments },
    { data: reserveMovements },
  ] = await Promise.all([
    // Income: paid payments this month
    supabase
      .from("payments")
      .select("amount_cop")
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", monthEnd),

    // All payments due this month (for collection rate)
    supabase
      .from("payments")
      .select("amount_cop, status")
      .gte("due_date", monthStart)
      .lt("due_date", monthEnd),

    // Expenses paid this month
    supabase
      .from("expenses")
      .select("amount_cop")
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", monthEnd),

    // All overdue payments (cartera morosa)
    supabase
      .from("payments")
      .select("amount_cop, late_fee_cop, unit_id")
      .eq("status", "overdue"),

    // Reserve fund: all movements
    supabase
      .from("reserve_fund_movements")
      .select("type, amount_cop"),
  ]);

  const totalIncome = (paidPayments ?? []).reduce(
    (sum, p) => sum + Number(p.amount_cop),
    0,
  );

  const totalExpenses = (paidExpenses ?? []).reduce(
    (sum, e) => sum + Number(e.amount_cop),
    0,
  );

  // Collection rate: paid / total due this month
  const totalDueMonth = (allPaymentsMonth ?? []).reduce(
    (sum, p) => sum + Number(p.amount_cop),
    0,
  );
  const paidDueMonth = (allPaymentsMonth ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount_cop), 0);
  const collectionRate =
    totalDueMonth > 0 ? (paidDueMonth / totalDueMonth) * 100 : 0;

  // Overdue totals
  const totalOverdue = (overduePayments ?? []).reduce(
    (sum, p) => sum + Number(p.amount_cop) + Number(p.late_fee_cop),
    0,
  );
  const overdueUnitIds = new Set(
    (overduePayments ?? []).map((p) => p.unit_id),
  );

  // Reserve fund balance
  const reserveFundBalance = (reserveMovements ?? []).reduce((sum, m) => {
    const amount = Number(m.amount_cop);
    return m.type === "income" ? sum + amount : sum - amount;
  }, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    collectionRate: Math.round(collectionRate * 10) / 10,
    totalOverdue,
    overdueUnitsCount: overdueUnitIds.size,
    reserveFundBalance,
  };
}
