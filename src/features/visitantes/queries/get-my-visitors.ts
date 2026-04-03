"use server";
import { createClient } from "@/lib/supabase/server";

export interface VisitorItem {
  id: string;
  full_name: string;
  document_number: string | null;
  phone: string | null;
  reason: string | null;
  is_favorite: boolean;
  group_name: string | null;
  authorized_until: string | null;
  expires_at: string | null;
  vehicle_plate: string | null;
  arrived_at: string | null;
  left_at: string | null;
  created_at: string;
  unit: { tower: string; apartment: string } | null;
}

export async function getMyVisitors(): Promise<VisitorItem[]> {
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
    .from("visitors")
    .select(
      `
      id, full_name, document_number, phone, reason,
      is_favorite, group_name, authorized_until, expires_at,
      vehicle_plate, arrived_at, left_at, created_at,
      unit:units (tower, apartment)
    `,
    )
    .in("unit_id", unitIds)
    .order("created_at", { ascending: false })
    .limit(100);

  return ((data as unknown as VisitorItem[]) ?? []).map((v) => ({
    ...v,
    unit: Array.isArray(v.unit) ? v.unit[0] ?? null : v.unit,
  }));
}
