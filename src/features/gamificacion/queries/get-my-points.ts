"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  ResidentPoints,
  PointTransaction,
  PointLevel,
} from "@/types/database";

export interface MyPointsData {
  points: ResidentPoints | null;
  recentTransactions: PointTransaction[];
}

const LEVEL_THRESHOLDS: { level: PointLevel; min: number }[] = [
  { level: "platino", min: 500 },
  { level: "oro", min: 200 },
  { level: "plata", min: 80 },
  { level: "bronce", min: 0 },
];

// NOTE: Not a server action — pure utility function.
// Extracted outside "use server" scope by making it a plain export.
// Since this file has "use server" at top, we must make it async
// to satisfy the Server Actions constraint.
export async function getNextLevel(current: PointLevel): Promise<{
  next: PointLevel | null;
  threshold: number;
  currentMin: number;
}> {
  const idx = LEVEL_THRESHOLDS.findIndex((l) => l.level === current);
  if (idx <= 0) return { next: null, threshold: 500, currentMin: 500 };
  const next = LEVEL_THRESHOLDS[idx - 1];
  const currentLevel = LEVEL_THRESHOLDS[idx];
  return {
    next: next.level,
    threshold: next.min,
    currentMin: currentLevel.min,
  };
}

export async function getMyPoints(): Promise<MyPointsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { points: null, recentTransactions: [] };

  const { data: resident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident)
    return { points: null, recentTransactions: [] };

  const [{ data: points }, { data: transactions }] = await Promise.all([
    supabase
      .from("resident_points")
      .select("*")
      .eq("resident_id", resident.id)
      .limit(1)
      .single(),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("resident_id", resident.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    points: (points as ResidentPoints) ?? null,
    recentTransactions:
      (transactions as PointTransaction[]) ?? [],
  };
}
