"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

type TabValue = "en_proceso" | "cerradas";

interface IncidentStep {
  label: string;
  completed: boolean;
  active: boolean;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  timeAgo: string;
  tab: TabValue;
  steps: IncidentStep[];
  scheduled?: {
    date: string;
    time: string;
  };
}

const incidents: Incident[] = [
  {
    id: "1",
    title: "Fuga de agua en pasillo",
    description:
      "Se detecto una fuga de agua en el pasillo del piso 3, cerca del apartamento 302.",
    badge: "EN REVISION",
    badgeColor: "text-amber-700",
    badgeBg: "bg-amber-100",
    timeAgo: "Hace 2 dias",
    tab: "en_proceso",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: false, active: true },
      { label: "Resuelto", completed: false, active: false },
    ],
  },
  {
    id: "2",
    title: "Luz fundida en parqueadero",
    description:
      "La luminaria del sector B del parqueadero lleva 3 dias sin funcionar.",
    badge: "PROGRAMADO",
    badgeColor: "text-blue-700",
    badgeBg: "bg-blue-100",
    timeAgo: "Hace 5 dias",
    tab: "en_proceso",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: false, active: false },
    ],
    scheduled: {
      date: "Jueves, 18 Nov",
      time: "10:00 AM",
    },
  },
  {
    id: "3",
    title: "Ascensor con ruido extraño",
    description: "El ascensor del bloque A presenta un ruido inusual al subir.",
    badge: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
    timeAgo: "Hace 2 semanas",
    tab: "cerradas",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: true, active: false },
    ],
  },
  {
    id: "4",
    title: "Filtracion en techo lobby",
    description: "Mancha de humedad en el techo del lobby principal.",
    badge: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
    timeAgo: "Hace 3 semanas",
    tab: "cerradas",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: true, active: false },
    ],
  },
  {
    id: "5",
    title: "Puerta de acceso danada",
    description: "La puerta principal del conjunto no cierra correctamente.",
    badge: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
    timeAgo: "Hace 1 mes",
    tab: "cerradas",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: true, active: false },
    ],
  },
  {
    id: "6",
    title: "Basura en zona verde",
    description: "Acumulacion de basura en la zona verde del bloque C.",
    badge: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
    timeAgo: "Hace 1 mes",
    tab: "cerradas",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: true, active: false },
    ],
  },
  {
    id: "7",
    title: "Ruido excesivo piso 5",
    description: "Quejas por ruido en horario nocturno del apartamento 502.",
    badge: "RESUELTO",
    badgeColor: "text-green-700",
    badgeBg: "bg-green-100",
    timeAgo: "Hace 2 meses",
    tab: "cerradas",
    steps: [
      { label: "Reportado", completed: true, active: false },
      { label: "Revision", completed: true, active: false },
      { label: "Resuelto", completed: true, active: false },
    ],
  },
];

export default function PqrPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("en_proceso");

  const enProceso = incidents.filter((i) => i.tab === "en_proceso");
  const cerradas = incidents.filter((i) => i.tab === "cerradas");
  const filtered = activeTab === "en_proceso" ? enProceso : cerradas;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="flex items-center gap-1 text-sm font-medium text-amber-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Inicio
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Incidencias</h1>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs pill */}
        <div className="mt-4 flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("en_proceso")}
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "en_proceso"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            En Proceso ({enProceso.length})
          </button>
          <button
            onClick={() => setActiveTab("cerradas")}
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "cerradas"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Cerradas ({cerradas.length})
          </button>
        </div>
      </header>

      {/* Incident Cards */}
      <div className="flex-1 space-y-3 px-4 py-4">
        {filtered.map((incident) => (
          <div
            key={incident.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
          >
            {/* Badge + Time */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${incident.badgeBg} ${incident.badgeColor}`}
              >
                {incident.badge}
              </span>
              <span className="text-xs text-gray-400">{incident.timeAgo}</span>
            </div>

            {/* Title + Description */}
            <h3 className="mt-2.5 text-sm font-bold text-gray-900">
              {incident.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {incident.description}
            </p>

            {/* Progress steps */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                {incident.steps.map((step, idx) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          step.completed
                            ? "bg-amber-500 text-white"
                            : step.active
                              ? "border-2 border-amber-500 bg-amber-50 text-amber-600"
                              : "border-2 border-gray-200 bg-white text-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : step.active ? (
                          <Clock className="h-3.5 w-3.5" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span
                        className={`mt-1 text-[10px] font-medium ${
                          step.completed || step.active
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < incident.steps.length - 1 && (
                      <div
                        className={`mx-1 mb-4 h-0.5 w-8 sm:w-12 ${
                          step.completed ? "bg-amber-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled info */}
            {incident.scheduled && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-800">
                    Reparacion programada para:
                  </p>
                  <p className="text-xs font-bold text-blue-900">
                    {incident.scheduled.date} - {incident.scheduled.time}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pb-24 pt-2 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
