"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get resident profile linked to this user
  const { data: resident } = await supabase
    .from("residents")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      role,
      is_owner,
      document_type,
      document_number,
      tenant_id,
      unit:units (
        id,
        tower,
        apartment
      ),
      tenant:tenants (
        id,
        name,
        slug,
        logo_url,
        primary_color
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  return {
    user,
    resident,
  };
}
