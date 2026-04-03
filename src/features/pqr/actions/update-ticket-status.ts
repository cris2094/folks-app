"use server";

import { createClient } from "@/lib/supabase/server";
import { updateTicketStatusSchema } from "../schemas/ticket";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "Sin residente vinculado" };

  if (resident.role !== "admin" && resident.role !== "super_admin") {
    return { error: "Solo administradores pueden cambiar el estado" };
  }

  const parsed = updateTicketStatusSchema.safeParse({
    ticket_id: formData.get("ticket_id"),
    status: formData.get("status"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const updateData: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("tickets")
    .update(updateData)
    .eq("id", parsed.data.ticket_id);

  if (error) return { error: error.message };

  revalidatePath(`/pqr/${parsed.data.ticket_id}`);
  revalidatePath("/pqr");
  return { success: true };
}
