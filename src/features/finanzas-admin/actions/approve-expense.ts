"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveExpense(
  expenseId: string,
  action: "approve" | "reject",
) {
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

  // Fetch expense scoped to same tenant
  const { data: expense } = await supabase
    .from("expenses")
    .select("id, status, approved_by, second_approved_by")
    .eq("id", expenseId)
    .eq("tenant_id", resident.tenant_id)
    .single();

  if (!expense) return { error: "Gasto no encontrado" };
  if (expense.status !== "pending") {
    return { error: "Solo se pueden aprobar/rechazar gastos pendientes" };
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("expenses")
      .update({ status: "rejected" })
      .eq("id", expenseId)
      .eq("tenant_id", resident.tenant_id);

    if (error) return { error: error.message };
  } else {
    // Approve logic: first approver or second approver
    if (!expense.approved_by) {
      // First approval
      const { error } = await supabase
        .from("expenses")
        .update({
          approved_by: resident.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", expenseId)
        .eq("tenant_id", resident.tenant_id);

      if (error) return { error: error.message };
    } else {
      // Prevent same person from being both approvers
      if (expense.approved_by === resident.id) {
        return { error: "No puedes ser el segundo aprobador del mismo gasto" };
      }
      // Second approval → mark as approved
      const { error } = await supabase
        .from("expenses")
        .update({
          second_approved_by: resident.id,
          status: "approved",
        })
        .eq("id", expenseId)
        .eq("tenant_id", resident.tenant_id);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/gastos");
  return { success: true };
}
