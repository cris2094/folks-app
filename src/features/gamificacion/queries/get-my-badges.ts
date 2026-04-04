"use server";

import { createClient } from "@/lib/supabase/server";
import type { Badge, ResidentBadge } from "@/types/database";

export interface BadgeWithStatus extends Badge {
  earned: boolean;
  earned_at: string | null;
}

export async function getMyBadges(): Promise<BadgeWithStatus[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return [];

  const [{ data: allBadges }, { data: earnedBadges }] = await Promise.all([
    supabase
      .from("badges")
      .select("*")
      .eq("tenant_id", resident.tenant_id)
      .order("points_reward", { ascending: true }),
    supabase
      .from("resident_badges")
      .select("*")
      .eq("resident_id", resident.id),
  ]);

  const earnedMap = new Map(
    ((earnedBadges as ResidentBadge[]) ?? []).map((eb) => [
      eb.badge_id,
      eb.earned_at,
    ]),
  );

  return ((allBadges as Badge[]) ?? []).map((badge) => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earned_at: earnedMap.get(badge.id) ?? null,
  }));
}
