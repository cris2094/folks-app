"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { registerSchema } from "../schemas/auth";

export async function registerWithEmail(formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return redirect(
      "/registro?error=" + encodeURIComponent(parsed.error.issues[0].message),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    return redirect("/registro?error=" + encodeURIComponent(error.message));
  }

  redirect("/registro?success=true");
}
