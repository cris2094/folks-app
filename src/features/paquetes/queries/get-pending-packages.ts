"use server";
import { createClient } from "@/lib/supabase/server";

export interface PendingPackageItem {
  id: string;
  description: string;
  received_by: string;
  received_at: string;
  status: string;
  unit_tower: string;
  unit_apartment: string;
}

export async function getPendingPackages(): Promise<PendingPackageItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (
    !resident ||
    (resident.role !== "portero" &&
      resident.role !== "admin" &&
      resident.role !== "super_admin")
  ) {
    return [];
  }

  const { data } = await supabase
    .from("packages")
    .select(
      `
      id, description, received_by, received_at, status,
      unit:units (tower, apartment)
    `,
    )
    .eq("tenant_id", resident.tenant_id)
    .in("status", ["received", "notified"])
    .order("received_at", { ascending: false })
    .limit(50);

  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => {
    const unit = Array.isArray(row.unit)
      ? row.unit[0]
      : (row.unit as Record<string, unknown> | null);

    return {
      id: row.id as string,
      description: row.description as string,
      received_by: row.received_by as string,
      received_at: row.received_at as string,
      status: row.status as string,
      unit_tower: (unit?.tower as string) ?? "",
      unit_apartment: (unit?.apartment as string) ?? "",
    };
  });
}
