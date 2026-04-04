"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { exportMyData } from "@/features/auth/actions/export-my-data";

export function ExportDataButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const result = await exportMyData();

      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.data) {
        const json = JSON.stringify(result.data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mis-datos-folks-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      {loading ? "Exportando..." : "Descargar mis datos"}
    </button>
  );
}
