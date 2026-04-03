"use server";

import { createClient } from "@/lib/supabase/server";
import type { AssemblyStatus, AssemblyType } from "@/types/database";

export interface AssemblyListItem {
  id: string;
  title: string;
  type: AssemblyType;
  date: string;
  location: string | null;
  status: AssemblyStatus;
  quorum_present: number | null;
  president: string | null;
  published_at: string | null;
  created_at: string;
  attendees_count: number;
  agenda_items_count: number;
  commitments_count: number;
  commitments_completed: number;
}

export interface GetAssembliesFilters {
  status?: AssemblyStatus;
  type?: AssemblyType;
  year?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getAssemblies(
  filters: GetAssembliesFilters = {},
): Promise<{ data: AssemblyListItem[]; count: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], count: 0 };

  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("assemblies")
    .select(
      `
      id,
      title,
      type,
      date,
      location,
      status,
      quorum_present,
      president,
      published_at,
      created_at,
      assembly_attendees (count),
      agenda_items (count),
      commitments (count),
      commitments_completed:commitments (count)
    `,
      { count: "exact" },
    )
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.type) {
    query = query.eq("type", filters.type);
  }
  if (filters.year) {
    const start = `${filters.year}-01-01T00:00:00Z`;
    const end = `${filters.year}-12-31T23:59:59Z`;
    query = query.gte("date", start).lte("date", end);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  // For completed commitments we need a filter on the nested count
  // Supabase JS doesn't support filtered count in nested selects directly,
  // so we'll compute it client-side from a separate query if needed.
  // For now, we use a simpler approach.

  const { data: rawData, count } = await query;

  if (!rawData) return { data: [], count: 0 };

  // Get completed commitments counts in one batch
  const assemblyIds = rawData.map(
    (a: Record<string, unknown>) => a.id as string,
  );

  const { data: completedCounts } = await supabase
    .from("commitments")
    .select("assembly_id")
    .in("assembly_id", assemblyIds)
    .eq("status", "completed");

  const completedMap = new Map<string, number>();
  (completedCounts ?? []).forEach(
    (c: { assembly_id: string }) => {
      completedMap.set(
        c.assembly_id,
        (completedMap.get(c.assembly_id) ?? 0) + 1,
      );
    },
  );

  const data: AssemblyListItem[] = rawData.map(
    (row: Record<string, unknown>) => {
      const attendees = row.assembly_attendees as
        | { count: number }[]
        | undefined;
      const agenda = row.agenda_items as { count: number }[] | undefined;
      const commits = row.commitments as { count: number }[] | undefined;

      return {
        id: row.id as string,
        title: row.title as string,
        type: row.type as AssemblyType,
        date: row.date as string,
        location: row.location as string | null,
        status: row.status as AssemblyStatus,
        quorum_present: row.quorum_present as number | null,
        president: row.president as string | null,
        published_at: row.published_at as string | null,
        created_at: row.created_at as string,
        attendees_count: attendees?.[0]?.count ?? 0,
        agenda_items_count: agenda?.[0]?.count ?? 0,
        commitments_count: commits?.[0]?.count ?? 0,
        commitments_completed:
          completedMap.get(row.id as string) ?? 0,
      };
    },
  );

  return { data, count: count ?? 0 };
}
