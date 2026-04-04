"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface AiSummaryCardProps {
  initialSummary: string;
}

export function AiSummaryCard({ initialSummary }: AiSummaryCardProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summary", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
      }
    } catch {
      // Silently fail, keep current summary
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200/50">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Resumen Ejecutivo IA
        </h3>
      </div>

      <div className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
        {summary}
      </div>

      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="mt-4 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Generando..." : "Regenerar con IA"}
      </button>
    </div>
  );
}
