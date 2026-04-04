"use client";

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
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion";
import type { ServiceStatus } from "../queries/get-utility-bills";
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
  al_dia: {
    label: "Al dia",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
  },
  vence_pronto: {
    label: "Vence pronto",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  vencido: {
    label: "Vencido",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
  sin_datos: {
    label: "Sin datos",
    icon: HelpCircle,
    color: "text-gray-400",
    bg: "bg-gray-50",
    dot: "bg-gray-300",
  },
};

const SERVICE_COLORS: Record<UtilityType, string> = {
  agua: "#3B82F6",
  energia: "#F59E0B",
  gas: "#EF4444",
  internet: "#8B5CF6",
  telefono: "#6366F1",
  aseo: "#10B981",
};

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

interface ServiciosClientProps {
  services: ServiceStatus[];
}

export function ServiciosClient({ services }: ServiciosClientProps) {
  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white px-5 pb-5 pt-6 shadow-sm">
        <p className="text-sm text-gray-400">Servicios Publicos</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Estado de servicios del conjunto
        </p>
      </div>

      {/* Service cards */}
      <div className="px-5 pt-5 pb-32">
        <StaggerContainer className="space-y-3">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? HelpCircle;
            const statusCfg = STATUS_CONFIG[service.status];
            const StatusIcon = statusCfg.icon;
            const color = SERVICE_COLORS[service.type];

            return (
              <StaggerItem key={service.type}>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="flex items-center gap-4 p-4">
                    {/* Icon */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: color + "12" }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Info */}
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
                        <p className="mt-0.5 text-xs text-gray-400">
                          {service.provider}
                        </p>
                      )}

                      {service.lastPayment && (
                        <div className="mt-2 flex items-center gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400">Ultimo pago</p>
                            <p className="text-xs font-medium text-gray-700">
                              {service.lastPayment.paid_at
                                ? formatDate(service.lastPayment.paid_at.slice(0, 10))
                                : "Pendiente"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Monto</p>
                            <p className="text-xs font-medium text-gray-700">
                              {formatCOP(service.lastPayment.amount_cop)}
                            </p>
                          </div>
                          {service.lastPayment.due_date && (
                            <div>
                              <p className="text-[10px] text-gray-400">Vence</p>
                              <p className={`text-xs font-medium ${service.status === "vencido" ? "text-red-600" : service.status === "vence_pronto" ? "text-amber-600" : "text-gray-700"}`}>
                                {formatDate(service.lastPayment.due_date)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
