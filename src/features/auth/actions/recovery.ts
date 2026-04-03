"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { recoverySchema } from "../schemas/auth";

export async function resetPassword(formData: FormData) {
  const parsed = recoverySchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return redirect(
      "/recovery?error=" + encodeURIComponent(parsed.error.issues[0].message),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (error) {
    return redirect("/recovery?error=" + encodeURIComponent(error.message));
  }

  redirect("/recovery?success=true");
}
