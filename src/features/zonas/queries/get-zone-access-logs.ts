"use server";
import { createClient } from "@/lib/supabase/server";

export interface ZoneAccessLogItem {
  id: string;
  zone_name: string;
  resident_name: string;
  unit_label: string;
  checked_in_at: string;
}

export async function getZoneAccessLogs(): Promise<ZoneAccessLogItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Only admin/super_admin can see this
  const { data: resident } = await supabase
    .from("residents")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (
    !resident ||
    (resident.role !== "admin" &&
      resident.role !== "super_admin" &&
      resident.role !== "consejo")
  ) {
    return [];
  }

  // Get recent reservations that are confirmed/completed as access log proxy
  const { data } = await supabase
    .from("reservations")
    .select(
      `
      id,
      date,
      start_time,
      status,
      created_at,
      zone:zones (name),
      resident:residents (full_name),
      unit:units (tower, apartment)
    `,
    )
    .eq("tenant_id", resident.tenant_id)
    .in("status", ["confirmed", "completed"])
    .order("date", { ascending: false })
    .limit(20);

  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => {
    const zone = Array.isArray(row.zone) ? row.zone[0] : row.zone;
    const res = Array.isArray(row.resident)
      ? row.resident[0]
      : row.resident;
    const unit = Array.isArray(row.unit) ? row.unit[0] : row.unit;

    const zoneName = (zone as Record<string, unknown> | null)?.name as string ?? "Zona";
    const residentName =
      (res as Record<string, unknown> | null)?.full_name as string ?? "Residente";
    const tower = (unit as Record<string, unknown> | null)?.tower as string ?? "";
    const apt = (unit as Record<string, unknown> | null)?.apartment as string ?? "";

    return {
      id: row.id as string,
      zone_name: zoneName,
      resident_name: residentName,
      unit_label: tower && apt ? `T${tower} - ${apt}` : "",
      checked_in_at: `${row.date} ${row.start_time ?? ""}`.trim(),
    };
  });
}
