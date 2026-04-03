"use server";

import { createClient } from "@/lib/supabase/server";
import type { ExpenseCategory, ExpenseStatus } from "@/types/database";

export interface ExpenseWithApprovers {
  id: string;
  category: ExpenseCategory;
  subcategory: string | null;
  description: string;
  amount_cop: number;
  expense_date: string;
  vendor: string | null;
  receipt_url: string | null;
  status: ExpenseStatus;
  approved_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  requested_by_resident: { full_name: string } | null;
  approved_by_resident: { full_name: string } | null;
  second_approved_by_resident: { full_name: string } | null;
}

export interface GetExpensesFilters {
  category?: ExpenseCategory;
  status?: ExpenseStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getExpenses(
  filters: GetExpensesFilters = {},
): Promise<{ data: ExpenseWithApprovers[]; count: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], count: 0 };

  // Verify admin role
  const { data: resident } = await supabase
    .from("residents")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident || !["admin", "super_admin"].includes(resident.role)) {
    return { data: [], count: 0 };
  }

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("expenses")
    .select(
      `
      id,
      category,
      subcategory,
      description,
      amount_cop,
      expense_date,
      vendor,
      receipt_url,
      status,
      approved_at,
      paid_at,
      notes,
      created_at,
      requested_by_resident:residents!expenses_requested_by_fkey (full_name),
      approved_by_resident:residents!expenses_approved_by_fkey (full_name),
      second_approved_by_resident:residents!expenses_second_approved_by_fkey (full_name)
    `,
      { count: "exact" },
    )
    .order("expense_date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.dateFrom) {
    query = query.gte("expense_date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("expense_date", filters.dateTo);
  }
  if (filters.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  const { data, count } = await query;

  return {
    data: (data as unknown as ExpenseWithApprovers[]) ?? [],
    count: count ?? 0,
  };
}
