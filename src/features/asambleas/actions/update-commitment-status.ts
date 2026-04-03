"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CommitmentStatus } from "@/types/database";

const NEXT_STATUS: Record<CommitmentStatus, CommitmentStatus> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
  overdue: "in_progress",
};

export async function updateCommitmentStatus(
  commitmentId: string,
  assemblyId: string,
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

  // Get current status
  const { data: commitment } = await supabase
    .from("commitments")
    .select("status")
    .eq("id", commitmentId)
    .single();

  if (!commitment) return { error: "Compromiso no encontrado" };

  const currentStatus = commitment.status as CommitmentStatus;
  const newStatus = NEXT_STATUS[currentStatus];
  const progress = newStatus === "completed" ? 100 : newStatus === "in_progress" ? 50 : 0;

  const { error } = await supabase
    .from("commitments")
    .update({
      status: newStatus,
      progress,
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commitmentId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/asambleas/${assemblyId}`);
  return { success: true, newStatus };
}
