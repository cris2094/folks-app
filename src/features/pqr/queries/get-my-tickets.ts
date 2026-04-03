"use server";

import { createClient } from "@/lib/supabase/server";

export interface TicketListItem {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  rating: number | null;
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resident: { full_name: string } | null;
  unit: { tower: string; apartment: string } | null;
}

export interface TicketCounts {
  open: number;
  in_progress: number;
  resolved: number;
  rated: number;
}

export async function getMyTickets(): Promise<{
  tickets: TicketListItem[];
  counts: TicketCounts;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { tickets: [], counts: { open: 0, in_progress: 0, resolved: 0, rated: 0 } };

  const { data: residents } = await supabase
    .from("residents")
    .select("id, unit_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length)
    return { tickets: [], counts: { open: 0, in_progress: 0, resolved: 0, rated: 0 } };

  const isAdmin = residents.some(
    (r) => r.role === "admin" || r.role === "super_admin"
  );
  const unitIds = residents.map((r) => r.unit_id);

  let query = supabase
    .from("tickets")
    .select(
      `
      id, subject, description, category, priority,
      status, rating, scheduled_date, created_at,
      updated_at, resolved_at,
      resident:residents!tickets_resident_id_fkey (full_name),
      unit:units (tower, apartment)
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Admin sees all tickets for the tenant, resident sees only their unit's
  if (!isAdmin) {
    query = query.in("unit_id", unitIds);
  }

  const { data } = await query;

  const tickets = (data as unknown as TicketListItem[]) ?? [];

  const counts: TicketCounts = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    rated: tickets.filter((t) => t.status === "rated").length,
  };

  return { tickets, counts };
}
