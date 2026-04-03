"use server";

import { createClient } from "@/lib/supabase/server";
import type { CommitmentStatus } from "@/types/database";

export interface PublicAssembly {
  id: string;
  title: string;
  date: string;
  summary: string | null;
}

export interface PublicCommitment {
  id: string;
  title: string;
  responsible: string | null;
  status: CommitmentStatus;
  progress: number;
  due_date: string | null;
}

export interface PublicBudget {
  periodName: string | null;
  totalBudgeted: number;
  totalExecuted: number;
  executionPercentage: number;
}

export interface PublicInfo {
  assemblies: PublicAssembly[];
  commitments: PublicCommitment[];
  budget: PublicBudget;
}

export async function getPublicInfo(): Promise<PublicInfo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const empty: PublicInfo = {
    assemblies: [],
    commitments: [],
    budget: {
      periodName: null,
      totalBudgeted: 0,
      totalExecuted: 0,
      executionPercentage: 0,
    },
  };

  if (!user) return empty;

  // Get tenant from resident
  const { data: resident } = await supabase
    .from("residents")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!resident) return empty;

  // Parallel fetch
  const [assembliesRes, commitmentsRes, budgetPeriodRes] =
    await Promise.all([
      // Last 5 published assemblies
      supabase
        .from("assemblies")
        .select("id, title, date, minutes_html")
        .eq("status", "published")
        .order("date", { ascending: false })
        .limit(5),

      // Active commitments (not completed)
      supabase
        .from("commitments")
        .select("id, title, responsible, status, progress, due_date")
        .in("status", ["pending", "in_progress", "overdue"])
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(10),

      // Active budget period with items
      supabase
        .from("budget_periods")
        .select("id, name, total_income_cop, total_expense_cop")
        .eq("status", "active")
        .limit(1)
        .single(),
    ]);

  // Process assemblies - extract a short summary from minutes_html
  const assemblies: PublicAssembly[] = (assembliesRes.data ?? []).map(
    (a: Record<string, unknown>) => {
      let summary: string | null = null;
      const html = a.minutes_html as string | null;
      if (html) {
        // Strip HTML tags and take first 200 chars as summary
        const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        summary = text.length > 200 ? text.substring(0, 200) + "..." : text;
      }
      return {
        id: a.id as string,
        title: a.title as string,
        date: a.date as string,
        summary,
      };
    },
  );

  // Commitments
  const commitments: PublicCommitment[] = (commitmentsRes.data ?? []).map(
    (c: Record<string, unknown>) => ({
      id: c.id as string,
      title: c.title as string,
      responsible: c.responsible as string | null,
      status: c.status as CommitmentStatus,
      progress: c.progress as number,
      due_date: c.due_date as string | null,
    }),
  );

  // Budget
  let budget: PublicBudget = {
    periodName: null,
    totalBudgeted: 0,
    totalExecuted: 0,
    executionPercentage: 0,
  };

  if (budgetPeriodRes.data) {
    const bp = budgetPeriodRes.data;

    // Get budget items for execution total
    const { data: budgetItems } = await supabase
      .from("budget_items")
      .select("budgeted_cop, executed_cop")
      .eq("budget_period_id", bp.id);

    const totalBudgeted = (budgetItems ?? []).reduce(
      (s: number, i: Record<string, unknown>) => s + Number(i.budgeted_cop),
      0,
    );
    const totalExecuted = (budgetItems ?? []).reduce(
      (s: number, i: Record<string, unknown>) => s + Number(i.executed_cop),
      0,
    );

    budget = {
      periodName: bp.name as string,
      totalBudgeted,
      totalExecuted,
      executionPercentage:
        totalBudgeted > 0
          ? Math.round((totalExecuted / totalBudgeted) * 1000) / 10
          : 0,
    };
  }

  return { assemblies, commitments, budget };
}
