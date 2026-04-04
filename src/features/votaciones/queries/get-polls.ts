"use server";

import { createClient } from "@/lib/supabase/server";

export interface PollListItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  requires_quorum: boolean;
  quorum_percentage: number;
  restricted: boolean;
  opens_at: string | null;
  closes_at: string | null;
  created_at: string;
  total_votes: number;
  has_voted: boolean;
}

export async function getPolls(): Promise<{
  active: PollListItem[];
  closed: PollListItem[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { active: [], closed: [] };

  // Get resident id
  const { data: resident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  // Get all polls
  const { data: polls } = await supabase
    .from("polls")
    .select("*")
    .in("status", ["open", "closed"])
    .order("created_at", { ascending: false });

  if (!polls?.length) return { active: [], closed: [] };

  // Get vote counts per poll
  const pollIds = polls.map((p) => p.id);
  const { data: votes } = await supabase
    .from("votes")
    .select("poll_id, resident_id")
    .in("poll_id", pollIds);

  const voteCounts: Record<string, number> = {};
  const myVotes = new Set<string>();

  (votes ?? []).forEach((v) => {
    voteCounts[v.poll_id] = (voteCounts[v.poll_id] ?? 0) + 1;
    if (resident && v.resident_id === resident.id) {
      myVotes.add(v.poll_id);
    }
  });

  const items: PollListItem[] = polls.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    status: p.status,
    requires_quorum: p.requires_quorum,
    quorum_percentage: p.quorum_percentage,
    restricted: p.restricted,
    opens_at: p.opens_at,
    closes_at: p.closes_at,
    created_at: p.created_at,
    total_votes: voteCounts[p.id] ?? 0,
    has_voted: myVotes.has(p.id),
  }));

  return {
    active: items.filter((p) => p.status === "open"),
    closed: items.filter((p) => p.status === "closed"),
  };
}
