"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateProfileInput {
  fullName: string;
  phone: string;
}

export async function updateProfile(input: UpdateProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const { error } = await supabase
    .from("residents")
    .update({
      full_name: input.fullName.trim(),
      phone: input.phone.trim() || null,
    })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (error) {
    return { error: "Error al actualizar. Intenta de nuevo." };
  }

  revalidatePath("/perfil");
  revalidatePath("/home");

  return { success: true };
}
