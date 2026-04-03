"use server";

import { createClient } from "@/lib/supabase/server";
import { createExpenseSchema } from "../schemas/expense";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
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
    return { error: "Solo administradores pueden registrar gastos" };
  }

  const rawAmount = formData.get("amount_cop");
  const parsed = createExpenseSchema.safeParse({
    category: formData.get("category"),
    subcategory: formData.get("subcategory") || undefined,
    description: formData.get("description"),
    amount_cop: rawAmount ? Number(rawAmount) : undefined,
    expense_date: formData.get("expense_date"),
    vendor: formData.get("vendor") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("expenses").insert({
    ...parsed.data,
    tenant_id: resident.tenant_id,
    requested_by: resident.id,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/gastos");
  return { success: true };
}
