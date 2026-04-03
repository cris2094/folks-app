"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markExpensePaid(expenseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (
    !resident ||
    (resident.role !== "admin" && resident.role !== "super_admin")
  ) {
    return { error: "No autorizado" };
  }

  // Verify expense exists, is approved, and belongs to same tenant
  const { data: expense } = await supabase
    .from("expenses")
    .select("id, status")
    .eq("id", expenseId)
    .eq("tenant_id", resident.tenant_id)
    .single();

  if (!expense) return { error: "Gasto no encontrado" };
  if (expense.status !== "approved") {
    return { error: "Solo se pueden marcar como pagados gastos aprobados" };
  }

  const { error } = await supabase
    .from("expenses")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", expenseId)
    .eq("tenant_id", resident.tenant_id);

  if (error) return { error: error.message };

  revalidatePath("/admin/gastos");
  return { success: true };
}
