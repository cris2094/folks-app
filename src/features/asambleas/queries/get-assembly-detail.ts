"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Assembly,
  AssemblyAttendee,
  AgendaItem,
  Commitment,
} from "@/types/database";

export interface AssemblyDetail extends Assembly {
  attendees: AssemblyAttendee[];
  agenda_items: AgendaItem[];
  commitments: CommitmentWithUnit[];
  created_by_name: string | null;
}

export interface CommitmentWithUnit extends Commitment {
  responsible_name: string | null;
  responsible_unit: string | null;
}

export async function getAssemblyDetail(
  assemblyId: string,
): Promise<AssemblyDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch assembly with creator name
  const { data: assembly } = await supabase
    .from("assemblies")
    .select(
      `
      *,
      creator:residents!assemblies_created_by_fkey (full_name)
    `,
    )
    .eq("id", assemblyId)
    .single();

  if (!assembly) return null;

  // Fetch related data in parallel
  const [attendeesRes, agendaRes, commitmentsRes] = await Promise.all([
    supabase
      .from("assembly_attendees")
      .select(
        `
        *,
        unit:units (tower, apartment)
      `,
      )
      .eq("assembly_id", assemblyId)
      .order("checked_in_at", { ascending: true }),

    supabase
      .from("agenda_items")
      .select("*")
      .eq("assembly_id", assemblyId)
      .order("position", { ascending: true }),

    supabase
      .from("commitments")
      .select(
        `
        *,
        responsible_resident:residents!commitments_responsible_id_fkey (
          full_name,
          unit:units (tower, apartment)
        )
      `,
      )
      .eq("assembly_id", assemblyId)
      .order("due_date", { ascending: true, nullsFirst: false }),
  ]);

  const creator = assembly.creator as
    | { full_name: string }
    | null;

  const commitments: CommitmentWithUnit[] = (
    commitmentsRes.data ?? []
  ).map((c: Record<string, unknown>) => {
    const responsible = c.responsible_resident as {
      full_name: string;
      unit: { tower: string; apartment: string } | null;
    } | null;

    return {
      id: c.id as string,
      assembly_id: c.assembly_id as string,
      tenant_id: c.tenant_id as string,
      title: c.title as string,
      description: c.description as string | null,
      responsible: c.responsible as string | null,
      responsible_id: c.responsible_id as string | null,
      due_date: c.due_date as string | null,
      status: c.status as Commitment["status"],
      progress: c.progress as number,
      completed_at: c.completed_at as string | null,
      created_at: c.created_at as string,
      updated_at: c.updated_at as string,
      responsible_name: responsible?.full_name ?? null,
      responsible_unit: responsible?.unit
        ? `${responsible.unit.tower}-${responsible.unit.apartment}`
        : null,
    };
  });

  return {
    id: assembly.id,
    tenant_id: assembly.tenant_id,
    title: assembly.title,
    type: assembly.type,
    date: assembly.date,
    location: assembly.location,
    convocation_type: assembly.convocation_type,
    quorum_required: assembly.quorum_required,
    quorum_present: assembly.quorum_present,
    total_units: assembly.total_units,
    units_present: assembly.units_present,
    status: assembly.status,
    audio_url: assembly.audio_url,
    transcript: assembly.transcript,
    minutes_html: assembly.minutes_html,
    minutes_pdf_url: assembly.minutes_pdf_url,
    president: assembly.president,
    secretary: assembly.secretary,
    created_by: assembly.created_by,
    published_at: assembly.published_at,
    created_at: assembly.created_at,
    updated_at: assembly.updated_at,
    created_by_name: creator?.full_name ?? null,
    attendees: (attendeesRes.data ?? []) as AssemblyAttendee[],
    agenda_items: (agendaRes.data ?? []) as AgendaItem[],
    commitments,
  };
}
