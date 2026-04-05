"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CommitmentStatus } from "@/types/database";

export async function updateCommitmentProgress(
  commitmentId: string,
  progress: number,
  status: CommitmentStatus,
) {
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

  if (
    !resident ||
    (resident.role !== "admin" && resident.role !== "super_admin")
  ) {
    return { error: "Solo administradores pueden actualizar compromisos" };
  }

  const clampedProgress = Math.min(100, Math.max(0, progress));

  const { error } = await supabase
    .from("commitments")
    .update({
      progress: clampedProgress,
      status,
      completed_at:
        status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commitmentId);

  if (error) return { error: error.message };

  revalidatePath("/transparencia");
  return { success: true };
}
