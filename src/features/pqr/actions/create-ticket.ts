"use server";

import { createClient } from "@/lib/supabase/server";
import { createTicketSchema } from "../schemas/ticket";
import { revalidatePath } from "next/cache";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id, unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "Sin residente vinculado" };

  const parsed = createTicketSchema.safeParse({
    category: formData.get("category"),
    priority: formData.get("priority") || "medium",
    subject: formData.get("subject"),
    description: formData.get("description"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: ticket, error } = await supabase
    .from("tickets")
    .insert({
      tenant_id: resident.tenant_id,
      unit_id: resident.unit_id,
      resident_id: resident.id,
      category: parsed.data.category,
      priority: parsed.data.priority,
      subject: parsed.data.subject,
      description: parsed.data.description,
      status: "open",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Create initial message with the description
  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    tenant_id: resident.tenant_id,
    sender_id: resident.id,
    message: parsed.data.description,
  });

  revalidatePath("/pqr");
  return { success: true, ticketId: ticket.id };
}
