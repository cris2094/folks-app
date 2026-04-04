"use server";

import { createClient } from "@/lib/supabase/server";
import type { PointLevel, PointReason } from "@/types/database";

const LEVEL_THRESHOLDS: { level: PointLevel; min: number }[] = [
  { level: "platino", min: 500 },
  { level: "oro", min: 200 },
  { level: "plata", min: 80 },
  { level: "bronce", min: 0 },
];

function calculateLevel(totalEarned: number): PointLevel {
  for (const { level, min } of LEVEL_THRESHOLDS) {
    if (totalEarned >= min) return level;
  }
  return "bronce";
}

const POINT_VALUES: Record<string, number> = {
  payment_ontime: 20,
  pqr_created: 10,
  assembly_attended: 30,
  reservation: 15,
};

export async function awardPoints(
  residentId: string,
  tenantId: string,
  reason: PointReason,
  referenceId?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const amount = POINT_VALUES[reason];
  if (!amount) return { success: false, error: "Razon de puntos invalida" };

  // Upsert resident_points - create if not exists
  const { data: existing } = await supabase
    .from("resident_points")
    .select("id, points, total_earned, total_spent")
    .eq("resident_id", residentId)
    .limit(1)
    .single();

  const newTotalEarned = (existing?.total_earned ?? 0) + amount;
  const newPoints = (existing?.points ?? 0) + amount;
  const newLevel = calculateLevel(newTotalEarned);

  if (existing) {
    const { error } = await supabase
      .from("resident_points")
      .update({
        points: newPoints,
        total_earned: newTotalEarned,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("resident_points").insert({
      tenant_id: tenantId,
      resident_id: residentId,
      points: amount,
      total_earned: amount,
      total_spent: 0,
      level: calculateLevel(amount),
    });

    if (error) return { success: false, error: error.message };
  }

  // Record transaction
  const { error: txError } = await supabase
    .from("point_transactions")
    .insert({
      tenant_id: tenantId,
      resident_id: residentId,
      type: "earn",
      amount,
      reason,
      reference_id: referenceId ?? null,
    });

  if (txError) return { success: false, error: txError.message };

  return { success: true };
}
