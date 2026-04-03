"use server";

import { createClient } from "@/lib/supabase/server";

export interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  rating: number | null;
  rated_at: string | null;
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resident: { id: string; full_name: string } | null;
  unit: { tower: string; apartment: string } | null;
  assigned: { full_name: string } | null;
}

export interface TicketMessageItem {
  id: string;
  sender_id: string;
  message: string;
  attachments: string[];
  created_at: string;
  sender: { id: string; full_name: string; role: string } | null;
}

export async function getTicketDetail(ticketId: string): Promise<{
  ticket: TicketDetail | null;
  messages: TicketMessageItem[];
  currentResidentId: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ticket: null, messages: [], currentResidentId: null };

  // Get current resident
  const { data: currentResident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  const { data: ticket } = await supabase
    .from("tickets")
    .select(
      `
      id, subject, description, category, priority,
      status, rating, rated_at, scheduled_date,
      created_at, updated_at, resolved_at,
      resident:residents!tickets_resident_id_fkey (id, full_name),
      unit:units (tower, apartment),
      assigned:residents!tickets_assigned_to_fkey (full_name)
    `
    )
    .eq("id", ticketId)
    .limit(1)
    .single();

  if (!ticket) return { ticket: null, messages: [], currentResidentId: null };

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select(
      `
      id, sender_id, message, attachments, created_at,
      sender:residents!ticket_messages_sender_id_fkey (id, full_name, role)
    `
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  return {
    ticket: ticket as unknown as TicketDetail,
    messages: (messages as unknown as TicketMessageItem[]) ?? [],
    currentResidentId: currentResident?.id ?? null,
  };
}
