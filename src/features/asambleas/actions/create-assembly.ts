"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAssemblySchema } from "../schemas/assembly";

export async function createAssembly(formData: FormData) {
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
    return { error: "Solo administradores pueden crear asambleas" };
  }

  const parsed = createAssemblySchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    date: formData.get("date"),
    location: formData.get("location"),
    president: formData.get("president") || undefined,
    secretary: formData.get("secretary") || undefined,
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: assembly, error } = await supabase
    .from("assemblies")
    .insert({
      title: parsed.data.title,
      type: parsed.data.type,
      date: parsed.data.date,
      location: parsed.data.location,
      president: parsed.data.president ?? null,
      secretary: parsed.data.secretary ?? null,
      tenant_id: resident.tenant_id,
      created_by: resident.id,
      status: "scheduled",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/asambleas");
  return { success: true, id: assembly.id };
}
