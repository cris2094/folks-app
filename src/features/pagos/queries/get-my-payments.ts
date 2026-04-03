"use server";

import { createClient } from "@/lib/supabase/server";

export interface PaymentWithUnit {
  id: string;
  concept: string;
  description: string | null;
  amount_cop: number;
  due_date: string;
  paid_at: string | null;
  status: string;
  late_fee_cop: number;
  receipt_url: string | null;
  created_at: string;
  unit: { tower: string; apartment: string } | null;
}

export async function getMyPayments(): Promise<PaymentWithUnit[]> {
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
    .from("payments")
    .select(`
      id,
      concept,
      description,
      amount_cop,
      due_date,
      paid_at,
      status,
      late_fee_cop,
      receipt_url,
      created_at,
      unit:units (
        tower,
        apartment
      )
    `)
    .in("unit_id", unitIds)
    .order("due_date", { ascending: false })
    .limit(50);

  return (data as unknown as PaymentWithUnit[]) ?? [];
}
