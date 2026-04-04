"use server";

import { createClient } from "@/lib/supabase/server";
import type { FolderKey } from "../queries/get-documents";

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { error: "No se encontro residente" };

  const adminRoles = ["super_admin", "admin", "consejo"];
  if (!adminRoles.includes(resident.role)) {
    return { error: "Sin permisos para subir archivos" };
  }

  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as FolderKey | null;

  if (!file || !folder) return { error: "Archivo y carpeta requeridos" };

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return { error: "Archivo muy grande (max 10MB)" };

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${resident.tenant_id}/${folder}/${timestamp}_${safeName}`;

  const { error } = await supabase.storage
    .from("documentos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return { error: error.message };
  return { success: true };
}
