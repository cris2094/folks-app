"use server";
import { createClient } from "@/lib/supabase/server";

export interface AccessLogItem {
  id: string;
  action: string;
  method: string;
  notes: string | null;
  created_at: string;
  visitor_name: string | null;
  unit_tower: string | null;
  unit_apartment: string | null;
}

export async function getAccessLog(): Promise<AccessLogItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return [];
  const unitIds = residents.map((r) => r.unit_id);

  const { data } = await supabase
    .from("access_logs")
    .select(
      `
      id, action, method, notes, created_at,
      visitor:visitors (full_name),
      unit:units (tower, apartment)
    `,
    )
    .in("unit_id", unitIds)
    .order("created_at", { ascending: false })
    .limit(50);

  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => {
    const visitor = Array.isArray(row.visitor)
      ? row.visitor[0]
      : (row.visitor as Record<string, unknown> | null);
    const unit = Array.isArray(row.unit)
      ? row.unit[0]
      : (row.unit as Record<string, unknown> | null);

    return {
      id: row.id as string,
      action: row.action as string,
      method: row.method as string,
      notes: row.notes as string | null,
      created_at: row.created_at as string,
      visitor_name: (visitor?.full_name as string) ?? null,
      unit_tower: (unit?.tower as string) ?? null,
      unit_apartment: (unit?.apartment as string) ?? null,
    };
  });
}
