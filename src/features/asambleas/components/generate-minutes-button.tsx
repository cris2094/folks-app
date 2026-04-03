"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { processAssemblyAudio } from "@/features/asambleas/actions/process-assembly-audio";

interface GenerateMinutesButtonProps {
  assemblyId: string;
  hasMinutes: boolean;
}

export function GenerateMinutesButton({
  assemblyId,
  hasMinutes,
}: GenerateMinutesButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await processAssemblyAudio(assemblyId);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  if (hasMinutes) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-400"
      >
        <Download className="h-4 w-4" />
        Descargar PDF (proximamente)
      </button>
    );
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <FileText className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Acta no generada
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Genera el acta automaticamente con IA a partir del audio o la
            transcripcion
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <button
          type="button"
          disabled={isPending}
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar Acta con IA
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
