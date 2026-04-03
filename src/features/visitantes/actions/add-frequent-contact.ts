"use server";
import { createClient } from "@/lib/supabase/server";
import { frequentContactSchema } from "../schemas/visitantes";
import { revalidatePath } from "next/cache";

export async function addFrequentContact(formData: FormData) {
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

  if (!resident) return { error: "No tienes un residente vinculado" };

  const parsed = frequentContactSchema.safeParse({
    name: formData.get("name"),
    document: formData.get("document") || null,
    phone: formData.get("phone") || null,
    relationship: formData.get("relationship"),
    is_favorite: formData.get("is_favorite") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("frequent_contacts").insert({
    tenant_id: resident.tenant_id,
    resident_id: resident.id,
    ...parsed.data,
  });

  if (error) return { error: error.message };

  revalidatePath("/visitantes");
  return { success: true };
}
