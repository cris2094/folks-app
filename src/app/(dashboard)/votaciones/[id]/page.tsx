import Link from "next/link";
import {
  ChevronLeft,
  Vote,
  Clock,
  Users,
  Lock,
} from "lucide-react";
import { notFound } from "next/navigation";
import { FadeIn, FadeInUp } from "@/components/motion";
import { getPollDetail } from "@/features/votaciones/queries/get-poll-detail";
import { VoteForm } from "@/features/votaciones/components/vote-form";
import { PollResults } from "@/features/votaciones/components/poll-results";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "ABIERTA", color: "text-emerald-700", bg: "bg-emerald-100" },
  closed: { label: "CERRADA", color: "text-gray-600", bg: "bg-gray-100" },
  draft: { label: "BORRADOR", color: "text-amber-700", bg: "bg-amber-100" },
  cancelled: { label: "CANCELADA", color: "text-red-700", bg: "bg-red-100" },
};

function QuorumBar({
  current,
  required,
}: {
  current: number;
  required: number;
}) {
  const pct = Math.min(100, (current / required) * 100);
  const reached = current >= required;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-gray-900">
            Quorum
          </span>
        </div>
        <span
          className={`text-[13px] font-bold ${reached ? "text-emerald-600" : "text-amber-600"}`}
        >
          {current.toFixed(0)}% / {required}%
        </span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            reached ? "bg-emerald-500" : "bg-amber-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {!reached && (
        <p className="mt-1.5 text-[11px] text-gray-400">
          Se requiere {required}% de participacion para validar
        </p>
      )}
    </div>
  );
}

export default async function PollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { poll } = await getPollDetail(id);

  if (!poll) notFound();

  const sc = statusConfig[poll.status] ?? statusConfig.open;
  const isOpen = poll.status === "open";
  const isClosed = poll.status === "closed";
  const showForm = isOpen && !poll.has_voted && !poll.restricted;
  const showResults = poll.has_voted || isClosed;

  return (
    <FadeIn>
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
        {/* Header */}
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/votaciones"
              className="flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Votaciones
            </Link>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.bg} ${sc.color}`}
            >
              {sc.label}
            </span>
          </div>
          <h1 className="mt-3 text-lg font-bold text-gray-900">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              {poll.description}
            </p>
          )}
        </header>

        {/* Info chips */}
        <FadeInUp delay={0.05}>
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
              <Vote className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} />
              <span className="text-[11px] font-medium text-gray-600">
                {poll.total_votes} {poll.total_votes === 1 ? "voto" : "votos"}
              </span>
            </div>
            {poll.closes_at && (
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                <Clock
                  className="h-3.5 w-3.5 text-gray-500"
                  strokeWidth={2}
                />
                <span className="text-[11px] font-medium text-gray-600">
                  Cierre:{" "}
                  {new Date(poll.closes_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            {poll.restricted && (
              <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5">
                <Lock
                  className="h-3.5 w-3.5 text-amber-600"
                  strokeWidth={2}
                />
                <span className="text-[11px] font-medium text-amber-700">
                  Presencial
                </span>
              </div>
            )}
          </div>
        </FadeInUp>

        {/* Quorum bar */}
        {poll.requires_quorum && (
          <FadeInUp delay={0.1}>
            <div className="px-5 pb-4">
              <QuorumBar
                current={poll.total_votes}
                required={poll.quorum_percentage}
              />
            </div>
          </FadeInUp>
        )}

        {/* Vote form or Results */}
        <FadeInUp delay={0.15}>
          <div className="px-5">
            {showForm && (
              <div>
                <p className="mb-3 text-[14px] font-semibold text-gray-900">
                  Selecciona tu opcion
                </p>
                <VoteForm
                  pollId={poll.id}
                  options={poll.options}
                  restricted={poll.restricted}
                />
              </div>
            )}

            {showResults && (
              <div>
                <p className="mb-3 text-[14px] font-semibold text-gray-900">
                  Resultados
                </p>
                <PollResults
                  options={poll.options}
                  totalVotes={poll.total_votes}
                  myVoteOptionId={poll.my_vote_option_id}
                />
              </div>
            )}

            {isOpen && !poll.has_voted && poll.restricted && (
              <VoteForm
                pollId={poll.id}
                options={poll.options}
                restricted={poll.restricted}
              />
            )}
          </div>
        </FadeInUp>

        {/* Footer */}
        <div className="pb-24 pt-6 text-center">
          <p className="text-[10px] font-medium tracking-wider text-gray-400">
            {"\u2726"} POTENCIADO POR FOLKS
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
