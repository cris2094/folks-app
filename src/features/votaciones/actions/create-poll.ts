"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreatePollInput {
  title: string;
  description?: string;
  type: "simple" | "multiple" | "weighted";
  requires_quorum: boolean;
  quorum_percentage: number;
  restricted: boolean;
  opens_at?: string;
  closes_at?: string;
  options: string[];
}

export async function createPoll(input: CreatePollInput) {
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

  if (!resident) return { error: "Sin residente vinculado" };

  if (resident.role !== "admin" && resident.role !== "super_admin") {
    return { error: "Sin permisos para crear votaciones" };
  }

  if (!input.title.trim()) return { error: "Titulo requerido" };
  if (input.options.length < 2) return { error: "Minimo 2 opciones" };

  const { data: poll, error } = await supabase
    .from("polls")
    .insert({
      tenant_id: resident.tenant_id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      type: input.type,
      status: input.opens_at ? "draft" : "open",
      requires_quorum: input.requires_quorum,
      quorum_percentage: input.quorum_percentage,
      restricted: input.restricted,
      opens_at: input.opens_at || null,
      closes_at: input.closes_at || null,
      created_by: resident.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Insert options
  const optionRows = input.options.map((label, idx) => ({
    poll_id: poll.id,
    tenant_id: resident.tenant_id,
    label: label.trim(),
    position: idx,
  }));

  const { error: optError } = await supabase
    .from("poll_options")
    .insert(optionRows);

  if (optError) return { error: optError.message };

  revalidatePath("/votaciones");
  return { success: true, pollId: poll.id };
}
