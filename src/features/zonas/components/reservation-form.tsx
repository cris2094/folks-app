"use client";

import { useState, useTransition, useMemo } from "react";
import { createReservation } from "../actions/create-reservation";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";

interface Schedule {
  [day: string]: { open: string; close: string } | null;
}

interface ReservationFormProps {
  zoneId: string;
  zoneName: string;
  priceCop: number;
  maxGuests: number;
  maxDurationHours: number;
  schedule: Schedule | null;
}

const DAY_MAP: Record<number, string> = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
};

function generateTimeSlots(open: string, close: string): string[] {
  const slots: string[] = [];
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);
  let h = openH;
  let m = openM;

  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }
  return slots;
}

export function ReservationForm({
  zoneId,
  zoneName,
  priceCop,
  maxGuests,
  maxDurationHours,
  schedule,
}: ReservationFormProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // Get available time slots based on selected date
  const timeSlots = useMemo(() => {
    if (!date || !schedule) return [];
    const dayIndex = new Date(date + "T12:00:00").getDay();
    const dayName = DAY_MAP[dayIndex];
    const slot = schedule[dayName];
    if (!slot) return [];
    return generateTimeSlots(slot.open, slot.close);
  }, [date, schedule]);

  // Filter end time slots based on start time and max duration
  const endSlots = useMemo(() => {
    if (!startTime || !timeSlots.length) return [];
    const startIdx = timeSlots.indexOf(startTime);
    if (startIdx === -1) return [];
    const maxSlots = maxDurationHours * 2; // 30-min intervals
    return timeSlots.slice(startIdx + 1, startIdx + 1 + maxSlots);
  }, [startTime, timeSlots, maxDurationHours]);

  const dayName = useMemo(() => {
    if (!date) return null;
    const dayIndex = new Date(date + "T12:00:00").getDay();
    return DAY_MAP[dayIndex];
  }, [date]);

  const isDayClosed = date && schedule && dayName ? !schedule[dayName] : false;

  function handleSubmit() {
    setResult(null);
    const formData = new FormData();
    formData.set("zone_id", zoneId);
    formData.set("date", date);
    formData.set("start_time", startTime);
    formData.set("end_time", endTime);
    formData.set("guests_count", String(guests));
    if (notes) formData.set("notes", notes);

    startTransition(async () => {
      const res = await createReservation(formData);
      setResult(res);
      if (res.success) {
        setDate("");
        setStartTime("");
        setEndTime("");
        setGuests(1);
        setNotes("");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-gray-900">
        Reservar {zoneName}
      </h3>

      {result?.success && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
          Reserva creada exitosamente
        </div>
      )}

      {result?.error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {result.error}
        </div>
      )}

      <div className="space-y-3">
        {/* Date */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            Fecha
          </label>
          <input
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => {
              setDate(e.target.value);
              setStartTime("");
              setEndTime("");
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
          />
          {isDayClosed && (
            <p className="mt-1 text-xs text-red-500">
              La zona esta cerrada este dia
            </p>
          )}
        </div>

        {/* Start time */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            Hora inicio
          </label>
          <select
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setEndTime("");
            }}
            disabled={!date || isDayClosed || timeSlots.length === 0}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* End time */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            Hora fin
          </label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={!startTime || endSlots.length === 0}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:opacity-50"
          >
            <option value="">Seleccionar</option>
            {endSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Users className="h-3.5 w-3.5" />
            Invitados (max {maxGuests})
          </label>
          <input
            type="number"
            min={0}
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 text-xs font-medium text-gray-600">
            Notas (opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Evento, ocasion..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
          />
        </div>

        {/* Price */}
        {priceCop > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3">
            <DollarSign className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              ${priceCop.toLocaleString("es-CO")} COP
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isPending || !date || !startTime || !endTime || isDayClosed}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "Reservando..." : "Reservar"}
        </button>
      </div>
    </div>
  );
}
