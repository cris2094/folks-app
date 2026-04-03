"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema } from "../schemas/auth";

export async function loginWithEmail(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return redirect(
      "/login?error=" + encodeURIComponent(parsed.error.issues[0].message),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/home");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect(data.url);
}
