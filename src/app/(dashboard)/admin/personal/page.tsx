"use client";

import {
  Shield,
  Wrench,
  Sparkles,
  DoorOpen,
  Phone,
  Clock,
  Users,
} from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import type { LucideIcon } from "lucide-react";

type StaffRole = "portero" | "seguridad" | "aseo" | "mantenimiento";
type StaffStatus = "active" | "inactive";

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  shift: string;
  phone: string;
  status: StaffStatus;
}

const ROLE_CONFIG: Record<
  StaffRole,
  { label: string; icon: LucideIcon; bg: string; text: string }
> = {
  portero: {
    label: "Portero",
    icon: DoorOpen,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  seguridad: {
    label: "Seguridad",
    icon: Shield,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  aseo: {
    label: "Aseo",
    icon: Sparkles,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  mantenimiento: {
    label: "Mantenimiento",
    icon: Wrench,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
};

const STAFF_MOCK: StaffMember[] = [
  {
    id: "1",
    name: "Carlos Ramirez",
    role: "portero",
    shift: "6:00 AM - 2:00 PM",
    phone: "310 555 1234",
    status: "active",
  },
  {
    id: "2",
    name: "Jorge Martinez",
    role: "portero",
    shift: "2:00 PM - 10:00 PM",
    phone: "311 555 5678",
    status: "active",
  },
  {
    id: "3",
    name: "Luis Hernandez",
    role: "portero",
    shift: "10:00 PM - 6:00 AM",
    phone: "312 555 9012",
    status: "active",
  },
  {
    id: "4",
    name: "Andres Gomez",
    role: "seguridad",
    shift: "6:00 AM - 6:00 PM",
    phone: "313 555 3456",
    status: "active",
  },
  {
    id: "5",
    name: "Pedro Lopez",
    role: "seguridad",
    shift: "6:00 PM - 6:00 AM",
    phone: "314 555 7890",
    status: "active",
  },
  {
    id: "6",
    name: "Maria Garcia",
    role: "aseo",
    shift: "7:00 AM - 3:00 PM",
    phone: "315 555 2345",
    status: "active",
  },
  {
    id: "7",
    name: "Rosa Torres",
    role: "aseo",
    shift: "7:00 AM - 3:00 PM",
    phone: "316 555 6789",
    status: "inactive",
  },
  {
    id: "8",
    name: "Fernando Diaz",
    role: "mantenimiento",
    shift: "8:00 AM - 5:00 PM",
    phone: "317 555 0123",
    status: "active",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function PersonalPage() {
  const active = STAFF_MOCK.filter((s) => s.status === "active");
  const inactive = STAFF_MOCK.filter((s) => s.status === "inactive");

  return (
    <div>
      {/* Stats */}
      <FadeInUp delay={0.05}>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <Users className="h-4 w-4 text-emerald-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{active.length}</p>
            <p className="text-[10px] text-gray-500">Activos</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-4 w-4 text-gray-400" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{inactive.length}</p>
            <p className="text-[10px] text-gray-500">Inactivos</p>
          </div>
        </div>
      </FadeInUp>

      {/* Staff list */}
      <FadeIn delay={0.1}>
        <p className="mb-3 text-[14px] font-semibold tracking-tight text-gray-900">
          Personal activo
        </p>
      </FadeIn>

      <StaggerContainer className="space-y-3">
        {active.map((person) => {
          const rc = ROLE_CONFIG[person.role];
          const RoleIcon = rc.icon;

          return (
            <StaggerItem key={person.id}>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${rc.bg}`}>
                    <span className={`text-sm font-bold ${rc.text}`}>
                      {getInitials(person.name)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${rc.bg} ${rc.text}`}
                      >
                        <RoleIcon className="h-3 w-3" strokeWidth={2} />
                        {rc.label}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={2} />
                        {person.shift}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" strokeWidth={2} />
                        {person.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Inactive */}
      {inactive.length > 0 && (
        <>
          <FadeIn delay={0.2}>
            <p className="mb-3 mt-6 text-[14px] font-semibold tracking-tight text-gray-900">
              Inactivos
            </p>
          </FadeIn>

          <div className="space-y-3">
            {inactive.map((person) => {
              const rc = ROLE_CONFIG[person.role];
              return (
                <div
                  key={person.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-sm font-bold text-gray-500">
                        {getInitials(person.name)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-semibold text-gray-600">
                        {person.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {rc.label} - Inactivo
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

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
