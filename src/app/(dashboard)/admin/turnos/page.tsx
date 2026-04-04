import { getShifts } from "@/features/turnos/queries/get-shifts";
import { TurnosPageClient } from "@/features/turnos/components/turnos-page-client";
import { FadeIn, FadeInUp } from "@/components/motion";

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export default async function TurnosPage() {
  const weekStart = getMonday(new Date());
  const { shifts, staffNames } = await getShifts(weekStart);

  return (
    <div>
      <FadeIn>
        <div className="mb-4">
          <h2 className="text-[16px] font-bold tracking-tight text-gray-900">
            Turnos del Personal
          </h2>
          <p className="mt-0.5 text-[12px] text-gray-500">
            Control de horarios y asistencia
          </p>
        </div>
      </FadeIn>

      <FadeInUp delay={0.1}>
        <TurnosPageClient
          shifts={shifts}
          staffNames={staffNames}
          weekStart={weekStart}
        />
      </FadeInUp>

      {/* Footer */}
      <div className="pb-8 pt-6 text-center">
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
