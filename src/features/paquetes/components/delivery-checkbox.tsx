"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Loader2, Package, Clock, User } from "lucide-react";
import { deliverPackage } from "@/features/paquetes/actions/deliver-package";

interface DeliveryCheckboxProps {
  packageId: string;
  description: string;
  receivedBy: string;
  receivedAt: string;
  unitTower: string;
  unitApartment: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DeliveryCheckbox({
  packageId,
  description,
  receivedBy,
  receivedAt,
  unitTower,
  unitApartment,
}: DeliveryCheckboxProps) {
  const [delivered, setDelivered] = useState(false);
  const [deliveredTo, setDeliveredTo] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDeliver() {
    if (!deliveredTo.trim()) {
      setError("Ingresa el nombre de quien recibe");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deliverPackage(packageId, deliveredTo.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setDelivered(true);
        setShowForm(false);
      }
    });
  }

  if (delivered) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
        <div>
          <p className="text-sm font-medium text-green-800">{description}</p>
          <p className="text-xs text-green-600">
            Entregado a {deliveredTo} · T{unitTower} Apto {unitApartment}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
          <Package className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tracking-tight text-gray-900">
            {description}
          </p>
          <p className="mt-0.5 text-[12px] text-gray-500">
            T{unitTower} - Apto {unitApartment}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(receivedAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {receivedBy}
            </span>
          </div>
        </div>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <CheckCircle className="h-4 w-4 text-gray-400" />
          Marcar como recibido por residente
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={deliveredTo}
            onChange={(e) => setDeliveredTo(e.target.value)}
            placeholder="Nombre de quien recibe"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleDeliver}
              className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" />
              ) : (
                "Confirmar entrega"
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            Se registrara fecha, hora y nombre de quien recibe
          </p>
        </div>
      )}
    </div>
  );
}
