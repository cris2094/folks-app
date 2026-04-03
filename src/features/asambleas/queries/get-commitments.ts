"use server";

import { createClient } from "@/lib/supabase/server";
import type { CommitmentStatus } from "@/types/database";

export interface CommitmentListItem {
  id: string;
  assembly_id: string;
  assembly_title: string;
  title: string;
  description: string | null;
  responsible: string | null;
  responsible_id: string | null;
  responsible_name: string | null;
  due_date: string | null;
  status: CommitmentStatus;
  progress: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  is_overdue: boolean;
}

export interface GetCommitmentsFilters {
  status?: CommitmentStatus;
  responsibleId?: string;
  assemblyId?: string;
  dueBefore?: string;
  dueAfter?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getCommitments(
  filters: GetCommitmentsFilters = {},
): Promise<{ data: CommitmentListItem[]; count: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], count: 0 };

  const limit = filters.limit ?? 30;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("commitments")
    .select(
      `
      id,
      assembly_id,
      title,
      description,
      responsible,
      responsible_id,
      due_date,
      status,
      progress,
      completed_at,
      created_at,
      updated_at,
      assembly:assemblies!commitments_assembly_id_fkey (title),
      responsible_resident:residents!commitments_responsible_id_fkey (full_name)
    `,
      { count: "exact" },
    )
    .order("due_date", { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.responsibleId) {
    query = query.eq("responsible_id", filters.responsibleId);
  }
  if (filters.assemblyId) {
    query = query.eq("assembly_id", filters.assemblyId);
  }
  if (filters.dueBefore) {
    query = query.lte("due_date", filters.dueBefore);
  }
  if (filters.dueAfter) {
    query = query.gte("due_date", filters.dueAfter);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data: rawData, count } = await query;

  if (!rawData) return { data: [], count: 0 };

  const today = new Date().toISOString().split("T")[0];

  const data: CommitmentListItem[] = rawData.map(
    (row: Record<string, unknown>) => {
      const assembly = row.assembly as { title: string } | null;
      const responsible = row.responsible_resident as {
        full_name: string;
      } | null;
      const dueDate = row.due_date as string | null;
      const status = row.status as CommitmentStatus;

      return {
        id: row.id as string,
        assembly_id: row.assembly_id as string,
        assembly_title: assembly?.title ?? "",
        title: row.title as string,
        description: row.description as string | null,
        responsible: row.responsible as string | null,
        responsible_id: row.responsible_id as string | null,
        responsible_name: responsible?.full_name ?? null,
        due_date: dueDate,
        status,
        progress: row.progress as number,
        completed_at: row.completed_at as string | null,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
        is_overdue:
          status !== "completed" &&
          dueDate !== null &&
          dueDate < today,
      };
    },
  );

  return { data, count: count ?? 0 };
}
