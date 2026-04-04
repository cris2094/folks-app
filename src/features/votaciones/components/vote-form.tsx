"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { castVote } from "../actions/cast-vote";
import type { PollOptionResult } from "../queries/get-poll-detail";

interface VoteFormProps {
  pollId: string;
  options: PollOptionResult[];
  restricted: boolean;
}

export function VoteForm({ pollId, options, restricted }: VoteFormProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (restricted) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-center text-[13px] font-medium text-amber-800">
          Esta votacion requiere asamblea presencial
        </p>
        <p className="mt-1 text-center text-[11px] text-amber-600">
          Decisiones que requieren 70% de coeficientes no pueden votarse
          virtualmente (Ley 675)
        </p>
      </div>
    );
  }

  function handleSubmit() {
    if (!selected) return;
    setError(null);

    startTransition(async () => {
      const result = await castVote(pollId, selected);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setSelected(option.id)}
          disabled={isPending}
          className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
            selected === option.id
              ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
              : "border-gray-100 bg-white hover:border-gray-200"
          } ${isPending ? "opacity-50" : ""}`}
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selected === option.id
                ? "border-amber-500 bg-amber-500"
                : "border-gray-300"
            }`}
          >
            {selected === option.id && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-[14px] font-medium text-gray-900">
            {option.label}
          </span>
        </button>
      ))}

      {error && (
        <div className="rounded-xl bg-red-50 px-3 py-2">
          <p className="text-[12px] text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || isPending}
        className="mt-2 w-full rounded-full bg-amber-500 py-3.5 text-[15px] font-semibold text-white shadow-apple-sm transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-amber-500"
      >
        {isPending ? "Enviando..." : "Votar"}
      </button>
    </div>
  );
}
