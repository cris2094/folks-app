"use client";

import type { PollOptionResult } from "../queries/get-poll-detail";

interface PollResultsProps {
  options: PollOptionResult[];
  totalVotes: number;
  myVoteOptionId: string | null;
}

export function PollResults({
  options,
  totalVotes,
  myVoteOptionId,
}: PollResultsProps) {
  // Sort by vote_count descending for results
  const sorted = [...options].sort((a, b) => b.vote_count - a.vote_count);
  const maxVotes = sorted[0]?.vote_count ?? 0;

  return (
    <div className="space-y-3">
      {sorted.map((option) => {
        const isWinner = option.vote_count === maxVotes && maxVotes > 0;
        const isMyVote = option.id === myVoteOptionId;

        return (
          <div
            key={option.id}
            className={`rounded-2xl border p-4 ${
              isWinner
                ? "border-amber-200 bg-amber-50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-gray-900">
                  {option.label}
                </span>
                {isMyVote && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    TU VOTO
                  </span>
                )}
              </div>
              <span className="text-[13px] font-bold text-gray-900">
                {option.percentage.toFixed(1)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isWinner ? "bg-amber-500" : "bg-gray-300"
                }`}
                style={{ width: `${option.percentage}%` }}
              />
            </div>

            <p className="mt-1.5 text-[11px] text-gray-400">
              {option.vote_count} {option.vote_count === 1 ? "voto" : "votos"}
            </p>
          </div>
        );
      })}

      <div className="pt-1 text-center">
        <p className="text-[12px] text-gray-400">
          Total: {totalVotes} {totalVotes === 1 ? "voto" : "votos"}
        </p>
      </div>
    </div>
  );
}
