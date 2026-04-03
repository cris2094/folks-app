"use server";

import { createClient } from "@/lib/supabase/server";
import { residentSchema } from "../schemas/propiedad";
import { revalidatePath } from "next/cache";

export async function updateResident(residentId: string, formData: FormData) {
  const supabase = await createClient();

  const parsed = residentSchema.safeParse({
    full_name: formData.get("full_name"),
    document_type: formData.get("document_type"),
    document_number: formData.get("document_number"),
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    is_owner: formData.get("is_owner") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("residents")
    .update(parsed.data)
    .eq("id", residentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/propiedad");
  return { success: true };
}
