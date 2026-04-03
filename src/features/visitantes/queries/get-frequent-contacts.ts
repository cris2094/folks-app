"use server";
import { createClient } from "@/lib/supabase/server";

export interface FrequentContactItem {
  id: string;
  name: string;
  document: string | null;
  phone: string | null;
  relationship: string | null;
  is_favorite: boolean;
  created_at: string;
}

export async function getFrequentContacts(): Promise<FrequentContactItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: resident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return [];

  const { data } = await supabase
    .from("frequent_contacts")
    .select("id, name, document, phone, relationship, is_favorite, created_at")
    .eq("resident_id", resident.id)
    .order("is_favorite", { ascending: false })
    .order("name");

  return (data as FrequentContactItem[]) ?? [];
}
