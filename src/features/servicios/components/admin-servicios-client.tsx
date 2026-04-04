"use client";

import { useState, useTransition } from "react";
import {
  Droplets,
  Zap,
  Flame,
  Wifi,
  Phone,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Plus,
  X,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import type { ServiceStatus, UtilityBillRecord } from "../queries/get-utility-bills";
import type { UtilityType } from "@/types/database";

const ICON_MAP: Record<string, typeof Droplets> = {
  droplets: Droplets,
  zap: Zap,
  flame: Flame,
  wifi: Wifi,
  phone: Phone,
  trash2: Trash2,
};

const STATUS_CONFIG = {
  al_dia: { label: "Al dia", dot: "bg-green-500", bg: "bg-green-50", color: "text-green-600" },
  vence_pronto: { label: "Vence pronto", dot: "bg-amber-500", bg: "bg-amber-50", color: "text-amber-600" },
  vencido: { label: "Vencido", dot: "bg-red-500", bg: "bg-red-50", color: "text-red-600" },
  sin_datos: { label: "Sin datos", dot: "bg-gray-300", bg: "bg-gray-50", color: "text-gray-400" },
};

const SERVICE_COLORS: Record<UtilityType, string> = {
  agua: "#3B82F6",
  energia: "#F59E0B",
  gas: "#EF4444",
  internet: "#8B5CF6",
  telefono: "#6366F1",
  aseo: "#10B981",
};

const UTILITY_TYPES: { value: UtilityType; label: string }[] = [
  { value: "agua", label: "Agua" },
  { value: "energia", label: "Energia" },
  { value: "gas", label: "Gas" },
  { value: "internet", label: "Internet" },
  { value: "telefono", label: "Telefono" },
  { value: "aseo", label: "Aseo" },
];

function formatCOP(n: number) {
  return `$${n.toLocaleString("es-CO")}`;
}

function formatDate(d: string | null) {
  if (!d) return "---";
  return new Date(d + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface AdminServiciosClientProps {
  services: ServiceStatus[];
}

export function AdminServiciosClient({ services }: AdminServiciosClientProps) {
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      {/* Service cards */}
      <StaggerContainer className="space-y-3">
        {services.map((service) => {
          const Icon = ICON_MAP[service.icon] ?? HelpCircle;
          const statusCfg = STATUS_CONFIG[service.status];
          const color = SERVICE_COLORS[service.type];

          return (
            <StaggerItem key={service.type}>
              <button
                onClick={() => setSelectedService(service)}
                className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm text-left transition-shadow hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: color + "12" }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-semibold text-gray-900">
                        {service.label}
                      </p>
                      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${statusCfg.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-[11px] font-medium ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                    {service.provider && (
                      <p className="mt-0.5 text-xs text-gray-400">{service.provider}</p>
                    )}
                    {service.lastPayment && (
                      <p className="mt-1 text-xs text-gray-500">
                        Ultimo: {formatCOP(service.lastPayment.amount_cop)} -{" "}
                        {formatDate(service.lastPayment.due_date)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Registrar pago button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm font-medium text-gray-500 transition-colors hover:border-amber-300 hover:text-amber-600 active:bg-gray-50"
      >
        <Plus className="h-4 w-4" />
        Registrar pago de servicio
      </button>

      {/* Service history modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceHistoryModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>

      {/* Add payment modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPaymentModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Service History Modal ----

function ServiceHistoryModal({
  service,
  onClose,
}: {
  service: ServiceStatus;
  onClose: () => void;
}) {
  const Icon = ICON_MAP[service.icon] ?? HelpCircle;
  const color = SERVICE_COLORS[service.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: color + "15" }}
          >
            <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {service.label}
            </h2>
            {service.provider && (
              <p className="text-xs text-gray-400">{service.provider}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <p className="mb-3 text-sm font-semibold text-gray-900">
          Historial de pagos
        </p>

        {service.allBills.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Sin registros
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {service.allBills.map((bill) => (
              <div key={bill.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  {bill.paid_at ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {bill.bill_period ?? "Sin periodo"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {bill.paid_at
                      ? `Pagado ${formatDate(bill.paid_at.slice(0, 10))}`
                      : `Vence ${formatDate(bill.due_date)}`}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 tabular-nums">
                  {formatCOP(bill.amount_cop)}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ---- Add Payment Modal ----

function AddPaymentModal({ onClose }: { onClose: () => void }) {
  const [utilityType, setUtilityType] = useState<UtilityType>("agua");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [provider, setProvider] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit() {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Monto invalido");
      return;
    }

    startTransition(async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("No autenticado");
        return;
      }

      const { data: resident } = await supabase
        .from("residents")
        .select("tenant_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .limit(1)
        .single();

      if (!resident) {
        setError("Sin residente");
        return;
      }

      const { error: insertError } = await supabase
        .from("utility_bills")
        .insert({
          tenant_id: resident.tenant_id,
          utility_type: utilityType,
          amount_cop: numAmount,
          bill_period: period || null,
          provider: provider || null,
          due_date: dueDate || null,
        });

      if (insertError) {
        setError(insertError.message);
      } else {
        onClose();
        window.location.reload();
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Registrar pago</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Servicio
            </label>
            <select
              value={utilityType}
              onChange={(e) => setUtilityType(e.target.value as UtilityType)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 focus:bg-white"
            >
              {UTILITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Monto (COP)
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Periodo (ej: 2026-04)
            </label>
            <input
              type="text"
              placeholder="2026-04"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Proveedor
            </label>
            <input
              type="text"
              placeholder="EPM, Vanti, etc."
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="mt-5 w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-amber-600 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Registrar"}
        </button>
      </motion.div>
    </motion.div>
  );
}
