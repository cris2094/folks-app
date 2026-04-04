import Link from "next/link";
import {
  ChevronLeft,
  Vote,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { getPolls } from "@/features/votaciones/queries/get-polls";
import { PollTabs } from "@/features/votaciones/components/poll-tabs";
import { FadeIn, FadeInUp } from "@/components/motion";

const statusBadge: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "ABIERTA", color: "text-emerald-700", bg: "bg-emerald-100" },
  closed: { label: "CERRADA", color: "text-gray-600", bg: "bg-gray-100" },
};

function timeLeft(closesAt: string | null) {
  if (!closesAt) return null;
  const diff = new Date(closesAt).getTime() - Date.now();
  if (diff <= 0) return "Finalizada";
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h restantes`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "dia" : "dias"} restantes`;
}

function PollCard({
  poll,
}: {
  poll: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    quorum_percentage: number;
    total_votes: number;
    has_voted: boolean;
    restricted: boolean;
    closes_at: string | null;
  };
}) {
  const sc = statusBadge[poll.status] ?? statusBadge.open;
  const remaining = timeLeft(poll.closes_at);

  return (
    <Link
      href={`/votaciones/${poll.id}`}
      className="block rounded-[20px] border border-gray-100 bg-white p-4 shadow-apple-sm transition-shadow hover:shadow-apple"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${sc.bg} ${sc.color}`}
        >
          {sc.label}
        </span>
        <div className="flex items-center gap-2">
          {poll.restricted && (
            <Lock className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
          )}
          {poll.has_voted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
              Votaste
            </span>
          )}
        </div>
      </div>

      {/* Title + description */}
      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-gray-900">
        {poll.title}
      </h3>
      {poll.description && (
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
          {poll.description}
        </p>
      )}

      {/* Restricted warning */}
      {poll.restricted && (
        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2">
          <p className="text-[11px] font-medium text-amber-700">
            Requiere asamblea presencial
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Vote className="h-3 w-3" strokeWidth={2} />
          {poll.total_votes} {poll.total_votes === 1 ? "voto" : "votos"}
        </span>
        <span className="flex items-center gap-1">
          Quorum: {poll.quorum_percentage}%
        </span>
        {remaining && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {remaining}
          </span>
        )}
      </div>
    </Link>
  );
}

export default async function VotacionesPage() {
  const { active, closed } = await getPolls();

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <FadeIn>
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Inicio
            </Link>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
              Votaciones
            </h1>
            <div className="w-8" />
          </div>
        </header>
      </FadeIn>

      <FadeInUp delay={0.1}>
        <PollTabs
          activasCount={active.length}
          cerradasCount={closed.length}
          activasContent={
            active.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Vote
                    className="h-8 w-8 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="font-medium text-gray-700">
                  Sin votaciones activas
                </p>
                <p className="text-[13px] text-gray-500">
                  Las votaciones abiertas apareceran aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {active.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            )
          }
          cerradasContent={
            closed.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <AlertTriangle
                    className="h-8 w-8 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="font-medium text-gray-700">
                  Sin votaciones cerradas
                </p>
                <p className="text-[13px] text-gray-500">
                  El historico de votaciones aparecera aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {closed.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            )
          }
        />
      </FadeInUp>

      {/* Footer */}
      <div className="pb-24 pt-2 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-medium tracking-wider text-gray-300">
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
