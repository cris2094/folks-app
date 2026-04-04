"use server";

import { createClient } from "@/lib/supabase/server";

export interface PollOptionResult {
  id: string;
  label: string;
  position: number;
  vote_count: number;
  percentage: number;
}

export interface PollDetail {
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
  options: PollOptionResult[];
  total_votes: number;
  has_voted: boolean;
  my_vote_option_id: string | null;
}

export async function getPollDetail(
  pollId: string
): Promise<{ poll: PollDetail | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { poll: null };

  const { data: resident } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  const { data: poll } = await supabase
    .from("polls")
    .select("*")
    .eq("id", pollId)
    .single();

  if (!poll) return { poll: null };

  // Get options
  const { data: options } = await supabase
    .from("poll_options")
    .select("id, label, position")
    .eq("poll_id", pollId)
    .order("position", { ascending: true });

  // Get all votes for this poll
  const { data: votes } = await supabase
    .from("votes")
    .select("option_id, resident_id")
    .eq("poll_id", pollId);

  const totalVotes = votes?.length ?? 0;

  // Count votes per option
  const optionVotes: Record<string, number> = {};
  let myVoteOptionId: string | null = null;

  (votes ?? []).forEach((v) => {
    optionVotes[v.option_id] = (optionVotes[v.option_id] ?? 0) + 1;
    if (resident && v.resident_id === resident.id) {
      myVoteOptionId = v.option_id;
    }
  });

  const optionResults: PollOptionResult[] = (options ?? []).map((o) => ({
    id: o.id,
    label: o.label,
    position: o.position,
    vote_count: optionVotes[o.id] ?? 0,
    percentage: totalVotes > 0 ? ((optionVotes[o.id] ?? 0) / totalVotes) * 100 : 0,
  }));

  return {
    poll: {
      id: poll.id,
      title: poll.title,
      description: poll.description,
      type: poll.type,
      status: poll.status,
      requires_quorum: poll.requires_quorum,
      quorum_percentage: poll.quorum_percentage,
      restricted: poll.restricted,
      opens_at: poll.opens_at,
      closes_at: poll.closes_at,
      created_at: poll.created_at,
      options: optionResults,
      total_votes: totalVotes,
      has_voted: myVoteOptionId !== null,
      my_vote_option_id: myVoteOptionId,
    },
  };
}
