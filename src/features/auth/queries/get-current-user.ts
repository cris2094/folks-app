"use server";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface ResidentProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_owner: boolean;
  document_type: string;
  document_number: string;
  tenant_id: string;
  unit: { id: string; tower: string; apartment: string } | null;
  tenant: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    primary_color: string;
  } | null;
}

export interface CurrentUserData {
  user: User;
  resident: ResidentProfile | null;
}

export async function getCurrentUser(): Promise<CurrentUserData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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
    resident: resident as ResidentProfile | null,
  };
}
