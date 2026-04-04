"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShiftItem } from "../queries/get-shifts";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  scheduled: {
    label: "Programado",
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  in_progress: {
    label: "En curso",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completado",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  absent: {
    label: "Ausente",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  portero: { label: "Portero", color: "text-blue-600" },
  seguridad: { label: "Seguridad", color: "text-purple-600" },
  aseo: { label: "Aseo", color: "text-emerald-600" },
  mantenimiento: { label: "Mantenimiento", color: "text-amber-600" },
};

const DAYS_ES = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface ShiftGridProps {
  initialShifts: ShiftItem[];
  initialStaffNames: string[];
  initialWeekStart: string;
}

export function ShiftGrid({
  initialShifts,
  initialStaffNames,
  initialWeekStart,
}: ShiftGridProps) {
  const [weekStart, setWeekStart] = useState(new Date(initialWeekStart));
  const [shifts] = useState(initialShifts);
  const [staffNames] = useState(initialStaffNames);

  // Build week dates
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  // Group shifts by staff_name + date
  const shiftMap: Record<string, ShiftItem[]> = {};
  shifts.forEach((s) => {
    const key = `${s.staff_name}__${s.shift_date}`;
    if (!shiftMap[key]) shiftMap[key] = [];
    shiftMap[key].push(s);
  });

  const weekLabel = `${weekDates[0].toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  })} - ${weekDates[6].toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  })}`;

  return (
    <div>
      {/* Week navigator */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            const prev = new Date(weekStart);
            prev.setDate(prev.getDate() - 7);
            setWeekStart(prev);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="text-[13px] font-semibold text-gray-900">
          {weekLabel}
        </span>
        <button
          onClick={() => {
            const next = new Date(weekStart);
            next.setDate(next.getDate() + 7);
            setWeekStart(next);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {staffNames.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <p className="font-medium text-gray-700">Sin turnos programados</p>
          <p className="text-[13px] text-gray-500">
            Agrega turnos para esta semana
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {staffNames.map((name) => {
            // Find the role from first shift
            const firstShift = shifts.find((s) => s.staff_name === name);
            const roleConfig = ROLE_CONFIG[firstShift?.role ?? ""] ?? {
              label: firstShift?.role ?? "",
              color: "text-gray-600",
            };

            return (
              <div
                key={name}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm"
              >
                {/* Staff header */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-gray-900">
                    {name}
                  </h3>
                  <span
                    className={`text-[11px] font-medium ${roleConfig.color}`}
                  >
                    {roleConfig.label}
                  </span>
                </div>

                {/* Week grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {DAYS_ES.map((day, i) => {
                    const isToday =
                      formatDate(weekDates[i]) === formatDate(new Date());
                    return (
                      <div
                        key={day}
                        className="flex flex-col items-center pb-1"
                      >
                        <span
                          className={`text-[9px] font-medium ${isToday ? "text-amber-600" : "text-gray-400"}`}
                        >
                          {day}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${isToday ? "text-amber-600" : "text-gray-600"}`}
                        >
                          {weekDates[i].getDate()}
                        </span>
                      </div>
                    );
                  })}

                  {/* Shift cells */}
                  {weekDates.map((date) => {
                    const key = `${name}__${formatDate(date)}`;
                    const dayShifts = shiftMap[key] ?? [];

                    if (dayShifts.length === 0) {
                      return (
                        <div
                          key={formatDate(date)}
                          className="flex h-12 items-center justify-center rounded-lg bg-gray-50"
                        >
                          <span className="text-[9px] text-gray-300">-</span>
                        </div>
                      );
                    }

                    const shift = dayShifts[0];
                    const sc = STATUS_CONFIG[shift.status] ?? STATUS_CONFIG.scheduled;

                    return (
                      <div
                        key={formatDate(date)}
                        className={`flex h-12 flex-col items-center justify-center rounded-lg ${sc.bg}`}
                      >
                        <div
                          className={`mb-0.5 h-1.5 w-1.5 rounded-full ${sc.dot}`}
                        />
                        <span
                          className={`text-[8px] font-medium leading-tight ${sc.text}`}
                        >
                          {formatTime(shift.start_time)}
                        </span>
                        <span
                          className={`text-[8px] font-medium leading-tight ${sc.text}`}
                        >
                          {formatTime(shift.end_time)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, sc]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${sc.dot}`} />
            <span className="text-[10px] text-gray-500">{sc.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
