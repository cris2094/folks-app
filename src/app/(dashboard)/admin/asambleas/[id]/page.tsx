import { notFound } from "next/navigation";
import { FadeIn, FadeInUp } from "@/components/motion";
import {
  getAssemblyDetail,
  type AssemblyDetail,
} from "@/features/asambleas/queries/get-assembly-detail";
import { AssemblyDetailTabs } from "@/features/asambleas/components/assembly-detail-tabs";
import type { AssemblyStatus, ConvocationType } from "@/types/database";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CONFIG: Record<
  AssemblyStatus,
  { bg: string; text: string; label: string }
> = {
  scheduled: { bg: "bg-gray-100", text: "text-gray-700", label: "Programada" },
  in_progress: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    label: "En curso",
  },
  transcribing: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Transcribiendo",
  },
  generating: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    label: "Generando acta",
  },
  review: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    label: "En revision",
  },
  published: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    label: "Publicada",
  },
};

const CONVOCATION_LABELS: Record<ConvocationType, string> = {
  first: "Primera convocatoria",
  second: "Segunda convocatoria",
  universal: "Reunion universal",
};

interface AssemblyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssemblyDetailPage({
  params,
}: AssemblyDetailPageProps) {
  const { id } = await params;
  const detail = await getAssemblyDetail(id);

  if (!detail) notFound();

  const statusStyle = STATUS_CONFIG[detail.status];

  const quorumPercent =
    detail.quorum_present != null && detail.quorum_required
      ? Math.round(
          (detail.quorum_present / detail.quorum_required) * 100,
        )
      : null;

  // Separate the assembly fields from the related data
  const assembly: AssemblyDetail = detail;

  return (
    <FadeIn>
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold">{detail.title}</h2>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p>{formatDate(detail.date)}</p>
          {detail.location && <p>Lugar: {detail.location}</p>}
          {detail.convocation_type && (
            <p>
              {CONVOCATION_LABELS[detail.convocation_type]}
            </p>
          )}
          {detail.president && <p>Presidente: {detail.president}</p>}
          {detail.secretary && <p>Secretario: {detail.secretary}</p>}
        </div>

        {/* Quorum bar */}
        {quorumPercent !== null && (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-gray-700">
                Quorum
              </span>
              <span className="text-xs text-muted-foreground">
                {detail.quorum_present}% / {detail.quorum_required}%
                requerido
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  quorumPercent >= 100
                    ? "bg-emerald-500"
                    : quorumPercent >= 70
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(quorumPercent, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
      <AssemblyDetailTabs
        assembly={assembly}
        attendees={detail.attendees}
        agendaItems={detail.agenda_items}
        commitments={detail.commitments}
      />
      </FadeInUp>

      <p className="pb-2 pt-6 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
    </FadeIn>
  );
}
