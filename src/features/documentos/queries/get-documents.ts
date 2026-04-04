"use server";

import { createClient } from "@/lib/supabase/server";

export interface DocumentFile {
  name: string;
  id: string | null;
  size: number;
  created_at: string;
  mime_type: string;
  url: string;
}

export const DOCUMENT_FOLDERS = [
  { key: "recibos", label: "Recibos", icon: "receipt" },
  { key: "actas", label: "Actas", icon: "file-text" },
  { key: "reglamento", label: "Reglamento", icon: "scale" },
  { key: "presupuesto", label: "Presupuesto", icon: "wallet" },
  { key: "otros", label: "Otros", icon: "folder" },
] as const;

export type FolderKey = (typeof DOCUMENT_FOLDERS)[number]["key"];

export async function getDocuments(
  folder: FolderKey,
): Promise<DocumentFile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return [];

  const bucketPath = `${resident.tenant_id}/${folder}`;

  const { data: files, error } = await supabase.storage
    .from("documentos")
    .list(bucketPath, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error || !files) return [];

  return files
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("documentos")
        .getPublicUrl(`${bucketPath}/${f.name}`);

      return {
        name: f.name,
        id: f.id,
        size: f.metadata?.size ?? 0,
        created_at: f.created_at ?? "",
        mime_type: f.metadata?.mimetype ?? "application/octet-stream",
        url: publicUrl,
      };
    });
}
