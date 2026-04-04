"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  MessageSquareWarning,
  Users,
  CalendarCheck,
} from "lucide-react";

const earnActions = [
  {
    icon: CreditCard,
    label: "Pagar a tiempo",
    points: 20,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: MessageSquareWarning,
    label: "Reportar incidencia",
    points: 10,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    label: "Asistir asamblea",
    points: 30,
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: CalendarCheck,
    label: "Reservar zona",
    points: 15,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export function EarnPointsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {earnActions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3 + i * 0.08,
            duration: 0.4,
            ease: "easeOut",
          }}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm"
        >
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}
          >
            <action.icon
              className={`h-5 w-5 ${action.iconColor}`}
              strokeWidth={1.5}
            />
          </div>
          <p className="mt-3 text-[13px] font-semibold tracking-tight text-gray-900">
            {action.label}
          </p>
          <p className="mt-0.5 text-[12px] font-semibold text-amber-500">
            +{action.points} pts
          </p>
        </motion.div>
      ))}
    </div>
  );
}
