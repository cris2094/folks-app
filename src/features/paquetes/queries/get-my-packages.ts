"use server";
import { createClient } from "@/lib/supabase/server";

export interface PackageItem {
  id: string;
  description: string;
  photo_url: string | null;
  received_by: string;
  received_at: string;
  delivered_at: string | null;
  delivered_to: string | null;
  status: string;
  unit: { tower: string; apartment: string }[] | null;
}

export async function getMyPackages(): Promise<PackageItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return [];
  const unitIds = residents.map((r) => r.unit_id);

  const { data } = await supabase
    .from("packages")
    .select(`
      id, description, photo_url, received_by,
      received_at, delivered_at, delivered_to, status,
      unit:units (tower, apartment)
    `)
    .in("unit_id", unitIds)
    .order("received_at", { ascending: false })
    .limit(50);

  return (data as unknown as PackageItem[]) ?? [];
}
