"use server";

import { createClient } from "@/lib/supabase/server";

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResolutionHours: number | null;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
}

export async function getTicketStats(): Promise<TicketStats> {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("tickets")
    .select("id, status, category, priority, created_at, resolved_at");

  if (!tickets?.length) {
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      avgResolutionHours: null,
      byCategory: {},
      byPriority: {},
    };
  }

  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter(
    (t) => t.status === "resolved" || t.status === "rated"
  ).length;

  // Average resolution time
  const resolvedWithTime = tickets.filter(
    (t) => t.resolved_at && t.created_at
  );
  let avgResolutionHours: number | null = null;
  if (resolvedWithTime.length > 0) {
    const totalHours = resolvedWithTime.reduce((sum, t) => {
      const created = new Date(t.created_at).getTime();
      const resolvedAt = new Date(t.resolved_at!).getTime();
      return sum + (resolvedAt - created) / (1000 * 60 * 60);
    }, 0);
    avgResolutionHours = Math.round(totalHours / resolvedWithTime.length);
  }

  // By category
  const byCategory: Record<string, number> = {};
  for (const t of tickets) {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  }

  // By priority
  const byPriority: Record<string, number> = {};
  for (const t of tickets) {
    if (t.priority) {
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    }
  }

  return {
    total: tickets.length,
    open,
    inProgress,
    resolved,
    avgResolutionHours,
    byCategory,
    byPriority,
  };
}
