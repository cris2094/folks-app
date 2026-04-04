"use server";

import { createClient } from "@/lib/supabase/server";

export interface AddTransactionInput {
  type: "income" | "expense";
  category: string;
  description: string;
  amount_cop: number;
  date: string;
  is_recurring?: boolean;
}

export async function addWalletTransaction(input: AddTransactionInput) {
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

  const { error } = await supabase.from("wallet_transactions").insert({
    tenant_id: resident.tenant_id,
    resident_id: resident.id,
    type: input.type,
    category: input.category,
    description: input.description,
    amount_cop: input.amount_cop,
    date: input.date,
    is_recurring: input.is_recurring ?? false,
  });

  if (error) return { error: error.message };
  return { success: true };
}
