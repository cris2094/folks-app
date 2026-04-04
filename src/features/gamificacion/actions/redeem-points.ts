"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function redeemPoints(
  pointsToSpend: number,
  description: string,
): Promise<{ success: boolean; error?: string; discount?: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data: resident } = await supabase
    .from("residents")
    .select("id, tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return { success: false, error: "Sin residente vinculado" };

  // Get current points
  const { data: pointsData } = await supabase
    .from("resident_points")
    .select("id, points, total_spent")
    .eq("resident_id", resident.id)
    .limit(1)
    .single();

  if (!pointsData)
    return { success: false, error: "No tienes puntos registrados" };

  if (pointsData.points < pointsToSpend)
    return { success: false, error: "Puntos insuficientes" };

  // 1 punto = $100 COP de descuento
  const discountCop = pointsToSpend * 100;

  // Update points
  const { error: updateError } = await supabase
    .from("resident_points")
    .update({
      points: pointsData.points - pointsToSpend,
      total_spent: pointsData.total_spent + pointsToSpend,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pointsData.id);

  if (updateError)
    return { success: false, error: updateError.message };

  // Record transaction
  const { error: txError } = await supabase
    .from("point_transactions")
    .insert({
      tenant_id: resident.tenant_id,
      resident_id: resident.id,
      type: "spend",
      amount: pointsToSpend,
      reason: "redeem_discount",
    });

  if (txError) return { success: false, error: txError.message };

  revalidatePath("/puntos");

  return { success: true, discount: discountCop };
}
