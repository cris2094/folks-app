"use client";

import { useState } from "react";
import { CalendarClock, Clock, Check } from "lucide-react";

const MOCK_APPOINTMENTS = [
  {
    id: "1",
    date: "2026-04-10",
    time: "10:00 AM",
    motivo: "Consulta sobre cuota extraordinaria",
    status: "confirmada",
  },
  {
    id: "2",
    date: "2026-04-15",
    time: "2:30 PM",
    motivo: "Revision de parqueadero",
    status: "pendiente",
  },
];

const TIME_SLOTS_AM = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];
const TIME_SLOTS_PM = [
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

export function CitasClient() {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [booked, setBooked] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = now.getDate();

  function handleBook() {
    if (!selectedDay || !selectedTime || !motivo.trim()) return;
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setSelectedDay(null);
      setSelectedTime(null);
      setMotivo("");
    }, 3000);
  }

  return (
    <div className="px-5 pt-5 space-y-5">
      {/* Calendar */}
      <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <h2 className="text-[15px] font-semibold text-gray-900 mb-3">
          {MONTH_NAMES[month]} {year}
        </h2>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-medium text-gray-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isPast = day < today;
            const isWeekend =
              new Date(year, month, day).getDay() === 0 ||
              new Date(year, month, day).getDay() === 6;
            const isSelected = selectedDay === day;
            const isToday = day === today;
            const isDisabled = isPast || isWeekend;

            return (
              <button
                key={day}
                disabled={isDisabled}
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedTime(null);
                }}
                className={`flex h-9 w-full items-center justify-center rounded-xl text-[13px] font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-sm"
                    : isToday
                      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      : isDisabled
                        ? "text-gray-300"
                        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDay && (
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Horarios disponibles
          </h3>

          <p className="text-[11px] font-medium text-gray-400 mb-2">Manana</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {TIME_SLOTS_AM.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`rounded-xl py-2 text-[12px] font-medium transition-all ${
                  selectedTime === slot
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <p className="text-[11px] font-medium text-gray-400 mb-2">Tarde</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS_PM.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`rounded-xl py-2 text-[12px] font-medium transition-all ${
                  selectedTime === slot
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Motivo + Book button */}
      {selectedDay && selectedTime && (
        <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
          {booked ? (
            <div className="flex flex-col items-center py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-3">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-[15px] font-semibold text-gray-900">
                Cita agendada
              </p>
              <p className="mt-1 text-[13px] text-gray-400">
                {selectedDay} de {MONTH_NAMES[month]}, {selectedTime}
              </p>
            </div>
          ) : (
            <>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Motivo de la cita
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe brevemente el motivo..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all resize-none"
              />
              <button
                onClick={handleBook}
                disabled={!motivo.trim()}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-[14px] font-semibold text-white transition-all hover:bg-amber-600 active:bg-amber-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <CalendarClock className="h-4 w-4" />
                Agendar Cita
              </button>
            </>
          )}
        </div>
      )}

      {/* Existing appointments */}
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-gray-900 mb-3">
          Mis citas
        </h3>
        <div className="space-y-2">
          {MOCK_APPOINTMENTS.map((apt) => (
            <div
              key={apt.id}
              className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-medium text-gray-900">
                    {apt.motivo}
                  </p>
                  <p className="mt-1 text-[12px] text-gray-400">
                    {new Date(apt.date + "T12:00:00").toLocaleDateString(
                      "es-CO",
                      {
                        day: "numeric",
                        month: "long",
                      }
                    )}{" "}
                    - {apt.time}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    apt.status === "confirmada"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {apt.status === "confirmada" ? "Confirmada" : "Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
