"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (error) {
    return redirect("/recovery?error=" + encodeURIComponent(error.message));
  }

  redirect("/recovery?success=true");
}
