"use server";

import { createClient } from "@/lib/supabase/server";
import { sendMessageSchema } from "../schemas/ticket";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
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

  if (!resident) return { error: "Sin residente vinculado" };

  const parsed = sendMessageSchema.safeParse({
    ticket_id: formData.get("ticket_id"),
    message: formData.get("message"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: parsed.data.ticket_id,
    tenant_id: resident.tenant_id,
    sender_id: resident.id,
    message: parsed.data.message,
  });

  if (error) return { error: error.message };

  revalidatePath(`/pqr/${parsed.data.ticket_id}`);
  return { success: true };
}
