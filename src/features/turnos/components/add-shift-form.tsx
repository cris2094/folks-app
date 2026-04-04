"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createShift } from "../actions/create-shift";

const ROLES = [
  { value: "portero", label: "Portero" },
  { value: "seguridad", label: "Seguridad" },
  { value: "aseo", label: "Aseo" },
  { value: "mantenimiento", label: "Mantenimiento" },
];

interface AddShiftFormProps {
  onClose: () => void;
}

export function AddShiftForm({ onClose }: AddShiftFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createShift({
        staff_name: form.get("staff_name") as string,
        role: form.get("role") as string,
        shift_date: form.get("shift_date") as string,
        start_time: form.get("start_time") as string,
        end_time: form.get("end_time") as string,
        notes: (form.get("notes") as string) || undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-xl">
        {/* Handle + close */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
          <h2 className="text-[15px] font-bold text-gray-900">
            Agregar Turno
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Staff name */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-500">
              Nombre del empleado
            </label>
            <input
              name="staff_name"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
              placeholder="Ej: Carlos Ramirez"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-500">
              Rol
            </label>
            <select
              name="role"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
            >
              <option value="">Seleccionar rol</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-500">
              Fecha
            </label>
            <input
              name="shift_date"
              type="date"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Entrada
              </label>
              <input
                name="start_time"
                type="time"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-gray-500">
                Salida
              </label>
              <input
                name="end_time"
                type="time"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-500">
              Notas (opcional)
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 outline-none transition-colors focus:border-amber-500 focus:bg-white"
              placeholder="Observaciones..."
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2">
              <p className="text-[12px] text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-amber-500 py-3.5 text-[15px] font-semibold text-white shadow-apple-sm transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-40"
          >
            {isPending ? "Guardando..." : "Agregar Turno"}
          </button>
        </form>
      </div>
    </div>
  );
}
