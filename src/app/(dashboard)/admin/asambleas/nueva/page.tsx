"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAssembly } from "@/features/asambleas/actions/create-assembly";

export default function NuevaAsambleaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createAssembly(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.success && result.id) {
      router.push(`/admin/asambleas/${result.id}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-amber-600" />
        <h2 className="text-lg font-bold">Nueva Asamblea</h2>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        {/* Titulo */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Titulo *</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ej: Asamblea General Ordinaria 2026"
            required
          />
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Tipo *</Label>
          <select
            id="type"
            name="type"
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="ordinary">Ordinaria</option>
            <option value="extraordinary">Extraordinaria</option>
          </select>
        </div>

        {/* Fecha */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Fecha y hora *</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            required
          />
        </div>

        {/* Lugar */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Lugar *</Label>
          <Input
            id="location"
            name="location"
            placeholder="Ej: Salon comunal, Torre A piso 1"
            required
          />
        </div>

        {/* Presidente */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="president">Presidente de asamblea</Label>
          <Input
            id="president"
            name="president"
            placeholder="Nombre del presidente"
          />
        </div>

        {/* Secretario */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="secretary">Secretario</Label>
          <Input
            id="secretary"
            name="secretary"
            placeholder="Nombre del secretario"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear Asamblea"}
          </button>
        </div>
      </form>
    </div>
  );
}
