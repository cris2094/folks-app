"use server";
import { createClient } from "@/lib/supabase/server";

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  category: string;
  is_pinned: boolean;
  attachments: string[];
  created_at: string;
  created_by_name: string | null;
}

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("announcements")
    .select(
      `
      id, title, body, category, is_pinned, attachments, created_at,
      author:residents!created_by (full_name)
    `,
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    title: a.title as string,
    body: a.body as string,
    category: a.category as string,
    is_pinned: a.is_pinned as boolean,
    attachments: a.attachments as string[],
    created_at: a.created_at as string,
    created_by_name: (
      Array.isArray(a.author)
        ? a.author[0]?.full_name
        : (a.author as Record<string, unknown>)?.full_name
    ) as string | null,
  }));
}
