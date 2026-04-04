"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function castVote(pollId: string, optionId: string) {
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

  // Verify poll exists and is open
  const { data: poll } = await supabase
    .from("polls")
    .select("id, status, restricted")
    .eq("id", pollId)
    .single();

  if (!poll) return { error: "Votacion no encontrada" };
  if (poll.status !== "open") return { error: "La votacion no esta abierta" };
  if (poll.restricted) {
    return { error: "Esta votacion requiere asamblea presencial" };
  }

  // Verify option belongs to this poll
  const { data: option } = await supabase
    .from("poll_options")
    .select("id")
    .eq("id", optionId)
    .eq("poll_id", pollId)
    .single();

  if (!option) return { error: "Opcion no valida" };

  // Check if already voted
  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("resident_id", resident.id)
    .limit(1)
    .single();

  if (existing) return { error: "Ya votaste en esta encuesta" };

  // Get coefficient from unit if weighted
  let coefficient: number | null = null;
  if (resident.unit_id) {
    const { data: unit } = await supabase
      .from("units")
      .select("area_m2")
      .eq("id", resident.unit_id)
      .single();

    if (unit?.area_m2) {
      coefficient = unit.area_m2;
    }
  }

  const { error } = await supabase.from("votes").insert({
    poll_id: pollId,
    option_id: optionId,
    tenant_id: resident.tenant_id,
    resident_id: resident.id,
    unit_id: resident.unit_id,
    coefficient,
  });

  if (error) {
    if (error.code === "23505") return { error: "Ya votaste en esta encuesta" };
    return { error: error.message };
  }

  revalidatePath(`/votaciones/${pollId}`);
  revalidatePath("/votaciones");
  return { success: true };
}
