import { FileText, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getAssemblies } from "@/features/asambleas/queries/get-assemblies";
import type { AssemblyStatus, AssemblyType } from "@/types/database";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

const TYPE_LABELS: Record<AssemblyType, string> = {
  ordinary: "Ordinaria",
  extraordinary: "Extraordinaria",
};

export default async function AsambleasPage() {
  const { data: assemblies, count } = await getAssemblies({ limit: 50 });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-bold">Asambleas</h2>
            <p className="text-xs text-muted-foreground">
              {count} registros
            </p>
          </div>
        </div>
        <Link
          href="/admin/asambleas/nueva"
          className="flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          Nueva Asamblea
        </Link>
      </div>

      {/* Lista */}
      {assemblies.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <FileText className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-sm text-muted-foreground">
            No hay asambleas registradas
          </p>
          <Link
            href="/admin/asambleas/nueva"
            className="text-sm font-medium text-amber-600 hover:underline"
          >
            Crear la primera asamblea
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {assemblies.map((assembly) => {
            const statusStyle = STATUS_CONFIG[assembly.status];
            const typeLabel = TYPE_LABELS[assembly.type];

            return (
              <Link
                key={assembly.id}
                href={`/admin/asambleas/${assembly.id}`}
              >
                <Card size="sm" className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {assembly.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(assembly.date)}
                          {assembly.president && (
                            <span>- Pres. {assembly.president}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                        {typeLabel}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.label}
                      </span>
                      {assembly.commitments_count > 0 && (
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          {assembly.commitments_completed}/
                          {assembly.commitments_count} compromisos
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
