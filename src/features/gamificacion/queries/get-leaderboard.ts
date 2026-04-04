"use server";

import { createClient } from "@/lib/supabase/server";

export interface LeaderboardEntry {
  resident_id: string;
  points: number;
  level: string;
  full_name: string;
  initials: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Get tenant from current user's resident
  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return [];

  const { data } = await supabase
    .from("resident_points")
    .select(
      `
      resident_id,
      points,
      level,
      resident:residents (
        full_name
      )
    `,
    )
    .eq("tenant_id", resident.tenant_id)
    .order("points", { ascending: false })
    .limit(10);

  if (!data) return [];

  return data.map((row) => {
    const residentData = row.resident as unknown as {
      full_name: string;
    } | null;
    const fullName = residentData?.full_name ?? "Residente";
    const initials = fullName
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase();

    return {
      resident_id: row.resident_id,
      points: row.points,
      level: row.level,
      full_name: fullName,
      initials,
    };
  });
}
