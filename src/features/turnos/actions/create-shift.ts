"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateShiftInput {
  staff_name: string;
  role: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export async function createShift(input: CreateShiftInput) {
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
    return { error: "Sin permisos" };
  }

  if (!input.staff_name.trim()) return { error: "Nombre requerido" };
  if (!input.role) return { error: "Rol requerido" };
  if (!input.shift_date) return { error: "Fecha requerida" };
  if (!input.start_time || !input.end_time) return { error: "Horario requerido" };

  const { error } = await supabase.from("staff_shifts").insert({
    tenant_id: resident.tenant_id,
    staff_name: input.staff_name.trim(),
    role: input.role,
    shift_date: input.shift_date,
    start_time: input.start_time,
    end_time: input.end_time,
    notes: input.notes?.trim() || null,
    status: "scheduled",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/turnos");
  return { success: true };
}
