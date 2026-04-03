"use server";

import { createClient } from "@/lib/supabase/server";
import type { ExpenseCategory, BudgetPeriodStatus } from "@/types/database";

export interface BudgetItemSummary {
  id: string;
  category: ExpenseCategory;
  description: string;
  budgeted_cop: number;
  executed_cop: number;
  difference: number;
  percentage: number;
}

export interface BudgetSummary {
  period: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: BudgetPeriodStatus;
  } | null;
  totalBudgeted: number;
  totalExecuted: number;
  executionPercentage: number;
  items: BudgetItemSummary[];
}

export async function getBudget(): Promise<BudgetSummary> {
  const empty: BudgetSummary = {
    period: null,
    totalBudgeted: 0,
    totalExecuted: 0,
    executionPercentage: 0,
    items: [],
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return empty;

  // Verify admin
  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return empty;
  }

  // Get active budget period
  const { data: period } = await supabase
    .from("budget_periods")
    .select("*")
    .eq("status", "active")
    .limit(1)
    .single();

  if (!period) return empty;

  // Get budget items
  const { data: items } = await supabase
    .from("budget_items")
    .select("*")
    .eq("budget_period_id", period.id)
    .order("category", { ascending: true });

  // Get actual expenses by category for this period
  const { data: expenses } = await supabase
    .from("expenses")
    .select("category, amount_cop")
    .eq("status", "paid")
    .gte("expense_date", period.start_date)
    .lte("expense_date", period.end_date);

  // Sum expenses by category
  const expenseByCategory = new Map<string, number>();
  (expenses ?? []).forEach((e: { category: string; amount_cop: number }) => {
    const current = expenseByCategory.get(e.category) ?? 0;
    expenseByCategory.set(e.category, current + Number(e.amount_cop));
  });

  const budgetItems: BudgetItemSummary[] = (items ?? []).map(
    (item: Record<string, unknown>) => {
      const budgeted = Number(item.budgeted_cop);
      const executed =
        expenseByCategory.get(item.category as string) ??
        Number(item.executed_cop);
      const difference = budgeted - executed;
      const percentage = budgeted > 0 ? (executed / budgeted) * 100 : 0;

      return {
        id: item.id as string,
        category: item.category as ExpenseCategory,
        description: item.description as string,
        budgeted_cop: budgeted,
        executed_cop: executed,
        difference,
        percentage: Math.round(percentage * 10) / 10,
      };
    },
  );

  const totalBudgeted = budgetItems.reduce((s, i) => s + i.budgeted_cop, 0);
  const totalExecuted = budgetItems.reduce((s, i) => s + i.executed_cop, 0);
  const executionPercentage =
    totalBudgeted > 0
      ? Math.round((totalExecuted / totalBudgeted) * 1000) / 10
      : 0;

  return {
    period: {
      id: period.id,
      name: period.name,
      start_date: period.start_date,
      end_date: period.end_date,
      status: period.status,
    },
    totalBudgeted,
    totalExecuted,
    executionPercentage,
    items: budgetItems,
  };
}
