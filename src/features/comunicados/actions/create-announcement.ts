"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(1, "El titulo es requerido").max(200),
  body: z.string().min(1, "El contenido es requerido").max(5000),
  category: z.enum([
    "general",
    "maintenance",
    "billing",
    "event",
    "emergency",
  ]),
  is_pinned: z.boolean().default(false),
});

export async function createAnnouncement(formData: FormData) {
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
    return { error: "Solo administradores pueden crear comunicados" };
  }

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    category: formData.get("category") ?? "general",
    is_pinned: formData.get("is_pinned") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("announcements").insert({
    ...parsed.data,
    tenant_id: resident.tenant_id,
    created_by: resident.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/comunicados");
  return { success: true };
}
