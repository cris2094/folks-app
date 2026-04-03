"use server";

import { createClient } from "@/lib/supabase/server";
import { rateTicketSchema } from "../schemas/ticket";
import { revalidatePath } from "next/cache";

export async function rateTicket(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const parsed = rateTicketSchema.safeParse({
    ticket_id: formData.get("ticket_id"),
    rating: Number(formData.get("rating")),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("tickets")
    .update({
      rating: parsed.data.rating,
      rated_at: new Date().toISOString(),
      status: "rated",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.ticket_id);

  if (error) return { error: error.message };

  revalidatePath(`/pqr/${parsed.data.ticket_id}`);
  revalidatePath("/pqr");
  return { success: true };
}
