"use server";

import { createClient } from "@/lib/supabase/server";
import type { UtilityType } from "@/types/database";

export interface UtilityBillRecord {
  id: string;
  utility_type: UtilityType;
  provider: string | null;
  bill_period: string | null;
  amount_cop: number;
  due_date: string | null;
  paid_at: string | null;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface ServiceStatus {
  type: UtilityType;
  label: string;
  icon: string;
  provider: string | null;
  lastPayment: UtilityBillRecord | null;
  status: "al_dia" | "vence_pronto" | "vencido" | "sin_datos";
  allBills: UtilityBillRecord[];
}

const SERVICE_LABELS: Record<UtilityType, string> = {
  agua: "Agua",
  energia: "Energia",
  gas: "Gas",
  internet: "Internet",
  telefono: "Telefono",
  aseo: "Aseo",
};

const SERVICE_ICONS: Record<UtilityType, string> = {
  agua: "droplets",
  energia: "zap",
  gas: "flame",
  internet: "wifi",
  telefono: "phone",
  aseo: "trash2",
};

export async function getUtilityBills(): Promise<ServiceStatus[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return [];

  const { data: bills } = await supabase
    .from("utility_bills")
    .select("*")
    .eq("tenant_id", resident.tenant_id)
    .order("created_at", { ascending: false });

  const allBills = (bills ?? []) as UtilityBillRecord[];
  const now = new Date();
  const soonThreshold = new Date();
  soonThreshold.setDate(soonThreshold.getDate() + 7);

  const serviceTypes: UtilityType[] = [
    "agua",
    "energia",
    "gas",
    "internet",
    "telefono",
    "aseo",
  ];

  return serviceTypes.map((type) => {
    const typeBills = allBills.filter((b) => b.utility_type === type);
    const lastBill = typeBills[0] ?? null;

    let status: ServiceStatus["status"] = "sin_datos";
    if (lastBill) {
      if (lastBill.paid_at) {
        status = "al_dia";
      } else if (lastBill.due_date) {
        const dueDate = new Date(lastBill.due_date);
        if (dueDate < now) {
          status = "vencido";
        } else if (dueDate <= soonThreshold) {
          status = "vence_pronto";
        } else {
          status = "al_dia";
        }
      }
    }

    return {
      type,
      label: SERVICE_LABELS[type],
      icon: SERVICE_ICONS[type],
      provider: lastBill?.provider ?? null,
      lastPayment: lastBill,
      status,
      allBills: typeBills,
    };
  });
}
