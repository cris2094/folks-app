"use server";

import { createClient } from "@/lib/supabase/server";

export interface SetBudgetInput {
  category: string;
  budget_cop: number;
  month: string;
}

export async function setWalletBudget(input: SetBudgetInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "No se encontro residente" };

  const { error } = await supabase.from("wallet_budgets").upsert(
    {
      tenant_id: resident.tenant_id,
      resident_id: resident.id,
      category: input.category,
      budget_cop: input.budget_cop,
      month: input.month,
    },
    { onConflict: "resident_id,category,month" },
  );

  if (error) return { error: error.message };
  return { success: true };
}
