"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Volume2,
  Shield,
  CreditCard,
  Trees,
  Car,
  PawPrint,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { createTicket } from "../actions/create-ticket";

const categories = [
  { value: "maintenance", label: "Mantenimiento", icon: Wrench },
  { value: "noise", label: "Ruido", icon: Volume2 },
  { value: "security", label: "Seguridad", icon: Shield },
  { value: "billing", label: "Cobros", icon: CreditCard },
  { value: "common_areas", label: "Zonas comunes", icon: Trees },
  { value: "parking", label: "Parqueadero", icon: Car },
  { value: "pets", label: "Mascotas", icon: PawPrint },
  { value: "suggestion", label: "Sugerencia", icon: Lightbulb },
  { value: "other", label: "Otro", icon: HelpCircle },
] as const;

const priorities = [
  { value: "low", label: "Baja", color: "bg-green-100 text-green-700" },
  { value: "medium", label: "Media", color: "bg-amber-100 text-amber-700" },
  { value: "high", label: "Alta", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgente", color: "bg-red-100 text-red-700" },
] as const;

export function CreateTicketForm() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const fd = new FormData();
    fd.set("category", category);
    fd.set("priority", priority);
    fd.set("subject", subject);
    fd.set("description", description);

    const result = await createTicket(fd);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push("/pqr");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-4 py-4">
      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Categoria
        </label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const selected = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-colors ${
                  selected
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    selected ? "text-amber-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    selected ? "text-amber-700" : "text-gray-600"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Prioridad
        </label>
        <div className="flex gap-2">
          {priorities.map((p) => {
            const selected = priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 rounded-full py-2 text-center text-xs font-semibold transition-colors ${
                  selected
                    ? p.color + " ring-2 ring-offset-1 ring-amber-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Titulo
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej: Fuga de agua en pasillo piso 3"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Descripcion
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el problema con el mayor detalle posible..."
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !category || !subject || !description}
        className="w-full rounded-full bg-amber-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-50"
      >
        {submitting ? "Enviando..." : "Reportar Incidencia"}
      </button>
    </form>
  );
}
