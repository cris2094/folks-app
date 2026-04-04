"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Zap,
  Droplets,
  Building2,
  Flame,
  Wind,
} from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import type { LucideIcon } from "lucide-react";

type EquipmentStatus = "operational" | "maintenance" | "out_of_service";

interface Equipment {
  id: string;
  name: string;
  location: string;
  icon: LucideIcon;
  status: EquipmentStatus;
  lastReview: string;
  nextMaintenance: string;
  brand?: string;
}

const STATUS_CONFIG: Record<
  EquipmentStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  operational: {
    label: "Operativo",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  maintenance: {
    label: "En mantenimiento",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  out_of_service: {
    label: "Fuera de servicio",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

const EQUIPMENT_MOCK: Equipment[] = [
  {
    id: "1",
    name: "Ascensor Torre A",
    location: "Torre A - Hall principal",
    icon: Building2,
    status: "operational",
    lastReview: "2026-03-15",
    nextMaintenance: "2026-04-15",
    brand: "Schindler",
  },
  {
    id: "2",
    name: "Ascensor Torre B",
    location: "Torre B - Hall principal",
    icon: Building2,
    status: "maintenance",
    lastReview: "2026-03-20",
    nextMaintenance: "2026-04-05",
    brand: "Schindler",
  },
  {
    id: "3",
    name: "Bomba de agua #1",
    location: "Cuarto de bombas - Sotano",
    icon: Droplets,
    status: "operational",
    lastReview: "2026-03-01",
    nextMaintenance: "2026-06-01",
    brand: "Pedrollo",
  },
  {
    id: "4",
    name: "Bomba de agua #2",
    location: "Cuarto de bombas - Sotano",
    icon: Droplets,
    status: "operational",
    lastReview: "2026-03-01",
    nextMaintenance: "2026-06-01",
    brand: "Pedrollo",
  },
  {
    id: "5",
    name: "Planta electrica",
    location: "Cuarto tecnico - Piso 1",
    icon: Zap,
    status: "operational",
    lastReview: "2026-02-28",
    nextMaintenance: "2026-05-28",
    brand: "Caterpillar",
  },
  {
    id: "6",
    name: "Sistema contra incendios",
    location: "General - Todas las torres",
    icon: Flame,
    status: "operational",
    lastReview: "2026-01-15",
    nextMaintenance: "2026-07-15",
  },
  {
    id: "7",
    name: "Extractor de aire sotano",
    location: "Parqueadero - Sotano 2",
    icon: Wind,
    status: "out_of_service",
    lastReview: "2026-02-10",
    nextMaintenance: "2026-04-01",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function MantenimientoPage() {
  const operational = EQUIPMENT_MOCK.filter(
    (e) => e.status === "operational"
  ).length;
  const inMaintenance = EQUIPMENT_MOCK.filter(
    (e) => e.status === "maintenance"
  ).length;
  const outOfService = EQUIPMENT_MOCK.filter(
    (e) => e.status === "out_of_service"
  ).length;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white">
      {/* Header */}
      <FadeIn>
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Inicio
            </Link>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
              Mantenimiento
            </h1>
            <div className="w-8" />
          </div>
          <p className="mt-1 text-center text-[13px] text-gray-500">
            Estado de equipos y reportes de danos
          </p>
        </header>
      </FadeIn>

      {/* Summary cards */}
      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-3 gap-3 px-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{operational}</p>
            <p className="text-[10px] text-gray-500">Operativos</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{inMaintenance}</p>
            <p className="text-[10px] text-gray-500">En mant.</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{outOfService}</p>
            <p className="text-[10px] text-gray-500">Fuera serv.</p>
          </div>
        </div>
      </FadeInUp>

      {/* Equipment list */}
      <div className="px-5 pt-6">
        <FadeIn delay={0.15}>
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Equipos del conjunto
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {EQUIPMENT_MOCK.map((equipment) => {
            const sc = STATUS_CONFIG[equipment.status];
            const days = daysUntil(equipment.nextMaintenance);
            const isUrgent = days <= 7 && equipment.status !== "out_of_service";

            return (
              <StaggerItem key={equipment.id}>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                      <equipment.icon
                        className="h-5 w-5 text-gray-600"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-semibold text-gray-900">
                          {equipment.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>

                      <p className="mt-0.5 text-[12px] text-gray-400">
                        {equipment.location}
                      </p>

                      {equipment.brand && (
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {equipment.brand}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-[11px]">
                        <div>
                          <span className="text-gray-400">Ultima revision: </span>
                          <span className="font-medium text-gray-600">
                            {formatDate(equipment.lastReview)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-gray-400">Proximo mant.: </span>
                          <span
                            className={`font-medium ${isUrgent ? "text-amber-600" : "text-gray-600"}`}
                          >
                            {formatDate(equipment.nextMaintenance)}
                            {isUrgent && ` (${days}d)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report failure button for out_of_service */}
                  {equipment.status === "out_of_service" && (
                    <Link
                      href="/pqr/nueva?category=maintenance"
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-100"
                    >
                      <Wrench className="h-3.5 w-3.5" strokeWidth={2} />
                      Reportar falla
                    </Link>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Report button */}
      <FadeInUp delay={0.3}>
        <div className="px-5 pt-6">
          <Link
            href="/pqr/nueva?category=maintenance"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] px-4 py-3.5 text-[14px] font-semibold text-white shadow-apple-sm transition-transform active:scale-[0.98]"
          >
            <AlertTriangle className="h-4 w-4" strokeWidth={2} />
            Reportar una falla
          </Link>
        </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-24 pt-8 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-medium tracking-wider text-gray-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
