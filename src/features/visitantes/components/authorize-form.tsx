"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authorizeVisitor } from "../actions/authorize-visitor";
import {
  Shield,
  User,
  FileText,
  Phone,
  Calendar,
  Car,
  Star,
  Clock,
} from "lucide-react";

const relationships = [
  { value: "family", label: "Familiar" },
  { value: "friend", label: "Amigo" },
  { value: "service", label: "Servicio" },
  { value: "delivery", label: "Delivery" },
];

export function AuthorizeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isTemporary, setIsTemporary] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await authorizeVisitor(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/visitantes");
      }
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-gray-700">
          <User className="h-3.5 w-3.5 text-gray-400" />
          Nombre completo
        </Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Juan Perez"
          required
          className="h-11 rounded-xl"
        />
      </div>

      {/* Documento */}
      <div className="space-y-1.5">
        <Label htmlFor="document_number" className="text-gray-700">
          <FileText className="h-3.5 w-3.5 text-gray-400" />
          Documento de identidad
        </Label>
        <Input
          id="document_number"
          name="document_number"
          placeholder="1234567890"
          required
          className="h-11 rounded-xl"
        />
      </div>

      {/* Telefono */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-gray-700">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          Telefono (opcional)
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="300 123 4567"
          className="h-11 rounded-xl"
        />
      </div>

      {/* Relacion */}
      <div className="space-y-1.5">
        <Label htmlFor="relationship" className="text-gray-700">
          <Shield className="h-3.5 w-3.5 text-gray-400" />
          Relacion
        </Label>
        <select
          id="relationship"
          name="relationship"
          required
          className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-gray-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Seleccionar...</option>
          {relationships.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha acceso */}
      <div className="space-y-1.5">
        <Label htmlFor="access_date" className="text-gray-700">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          Fecha de acceso
        </Label>
        <Input
          id="access_date"
          name="access_date"
          type="date"
          defaultValue={today}
          required
          className="h-11 rounded-xl"
        />
      </div>

      {/* Toggle favorito */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
        <label
          htmlFor="is_favorite"
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <Star className="h-4 w-4 text-amber-400" />
          Agregar a favoritos
        </label>
        <input
          type="checkbox"
          id="is_favorite"
          name="is_favorite"
          className="h-5 w-5 rounded accent-amber-500"
        />
      </div>

      {/* Toggle temporal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <label
            htmlFor="is_temporary"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Clock className="h-4 w-4 text-gray-500" />
            Acceso temporal
          </label>
          <input
            type="checkbox"
            id="is_temporary"
            name="is_temporary"
            checked={isTemporary}
            onChange={(e) => setIsTemporary(e.target.checked)}
            className="h-5 w-5 rounded accent-amber-500"
          />
        </div>
        {isTemporary && (
          <div className="space-y-1.5 pl-1">
            <Label htmlFor="expires_at" className="text-gray-700">
              Fecha de expiracion
            </Label>
            <Input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              className="h-11 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Placa vehiculo */}
      <div className="space-y-1.5">
        <Label htmlFor="vehicle_plate" className="text-gray-700">
          <Car className="h-3.5 w-3.5 text-gray-400" />
          Placa vehiculo (opcional)
        </Label>
        <Input
          id="vehicle_plate"
          name="vehicle_plate"
          placeholder="ABC 123"
          className="h-11 rounded-xl"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-full bg-amber-500 text-base font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {isPending ? "Autorizando..." : "Autorizar Acceso"}
      </Button>
    </form>
  );
}
