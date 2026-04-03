import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  // Solo funciona si hay service role key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Crear usuario
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: "admin@irawa.com",
      password: "1234",
      email_confirm: true,
    });

  if (authError && !authError.message.includes("already")) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData?.user?.id;
  if (!userId) {
    // User might already exist, try to get them
    const { data: existingUsers } =
      await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(
      (u) => u.email === "admin@irawa.com"
    );
    if (!existing)
      return NextResponse.json(
        { error: "Could not create or find user" },
        { status: 400 }
      );

    // Update to ensure role is admin
    const { data: tenant } = await supabaseAdmin
      .from("tenants")
      .select("id")
      .limit(1)
      .single();
    if (tenant) {
      await supabaseAdmin.from("residents").upsert(
        {
          user_id: existing.id,
          tenant_id: tenant.id,
          full_name: "Admin IRAWA",
          role: "admin",
          is_active: true,
        },
        { onConflict: "user_id" }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Admin user already exists, role updated",
    });
  }

  // Assign to first tenant as admin
  const { data: tenant } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .limit(1)
    .single();
  if (tenant) {
    // Find a unit for admin
    const { data: unit } = await supabaseAdmin
      .from("units")
      .select("id")
      .eq("tenant_id", tenant.id)
      .limit(1)
      .single();

    await supabaseAdmin.from("residents").insert({
      user_id: userId,
      tenant_id: tenant.id,
      unit_id: unit?.id,
      full_name: "Admin IRAWA",
      role: "admin",
      is_active: true,
    });
  }

  return NextResponse.json({ success: true, userId });
}
