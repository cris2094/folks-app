"use server";

import { createClient } from "@/lib/supabase/server";

export interface WalletTransaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount_cop: number;
  date: string;
  is_recurring: boolean;
  created_at: string;
}

export interface WalletBudget {
  id: string;
  category: string;
  budget_cop: number;
  month: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  budget: number;
  percentage: number;
}

export interface WalletSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categories: CategorySummary[];
  transactions: WalletTransaction[];
  budgets: WalletBudget[];
}

export async function getWalletSummary(month?: string): Promise<WalletSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categories: [],
      transactions: [],
      budgets: [],
    };

  const { data: resident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident)
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categories: [],
      transactions: [],
      budgets: [],
    };

  const now = new Date();
  const currentMonth =
    month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const startDate = `${currentMonth}-01`;
  const endYear = parseInt(currentMonth.split("-")[0]);
  const endMonth = parseInt(currentMonth.split("-")[1]);
  const lastDay = new Date(endYear, endMonth, 0).getDate();
  const endDate = `${currentMonth}-${lastDay}`;

  const [{ data: transactions }, { data: budgets }] = await Promise.all([
    supabase
      .from("wallet_transactions")
      .select("*")
      .eq("resident_id", resident.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false }),
    supabase
      .from("wallet_budgets")
      .select("*")
      .eq("resident_id", resident.id)
      .eq("month", currentMonth),
  ]);

  const txList = (transactions ?? []) as WalletTransaction[];
  const budgetList = (budgets ?? []) as WalletBudget[];

  const totalIncome = txList
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount_cop), 0);
  const totalExpenses = txList
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount_cop), 0);

  // Build category summaries for expenses
  const expenseByCategory: Record<string, number> = {};
  txList
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] =
        (expenseByCategory[t.category] ?? 0) + Number(t.amount_cop);
    });

  const budgetMap: Record<string, number> = {};
  budgetList.forEach((b) => {
    budgetMap[b.category] = Number(b.budget_cop);
  });

  const allCategories = new Set([
    ...Object.keys(expenseByCategory),
    ...Object.keys(budgetMap),
  ]);

  const categories: CategorySummary[] = Array.from(allCategories).map((cat) => {
    const total = expenseByCategory[cat] ?? 0;
    const budget = budgetMap[cat] ?? 0;
    return {
      category: cat,
      total,
      budget,
      percentage: budget > 0 ? Math.round((total / budget) * 100) : 0,
    };
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    categories,
    transactions: txList,
    budgets: budgetList,
  };
}
