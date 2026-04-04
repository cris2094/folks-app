"use server";

import { createClient } from "@/lib/supabase/server";

export interface ShiftItem {
  id: string;
  staff_name: string;
  role: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  status: string;
  check_in_at: string | null;
  check_out_at: string | null;
  notes: string | null;
}

export async function getShifts(weekStart: string): Promise<{
  shifts: ShiftItem[];
  staffNames: string[];
}> {
  const supabase = await createClient();

  // Get shifts for the week (7 days from weekStart)
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const { data } = await supabase
    .from("staff_shifts")
    .select("*")
    .gte("shift_date", weekStart)
    .lte("shift_date", end.toISOString().split("T")[0])
    .order("shift_date", { ascending: true })
    .order("start_time", { ascending: true });

  const shifts = (data ?? []) as ShiftItem[];

  // Extract unique staff names
  const staffNames = [...new Set(shifts.map((s) => s.staff_name))].sort();

  return { shifts, staffNames };
}
