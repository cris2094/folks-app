"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ShiftGrid } from "./shift-grid";
import { AddShiftForm } from "./add-shift-form";
import type { ShiftItem } from "../queries/get-shifts";

interface TurnosPageClientProps {
  shifts: ShiftItem[];
  staffNames: string[];
  weekStart: string;
}

export function TurnosPageClient({
  shifts,
  staffNames,
  weekStart,
}: TurnosPageClientProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {/* Add button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white shadow-apple-sm transition-all hover:bg-amber-600 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Agregar Turno
        </button>
      </div>

      {/* Grid */}
      <ShiftGrid
        initialShifts={shifts}
        initialStaffNames={staffNames}
        initialWeekStart={weekStart}
      />

      {/* Modal */}
      {showForm && <AddShiftForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
