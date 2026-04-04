"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  MessageSquareWarning,
  Users,
  CalendarCheck,
  Gift,
  Clock,
} from "lucide-react";
import type { PointTransaction } from "@/types/database";

const reasonConfig: Record<
  string,
  { label: string; icon: typeof CreditCard; iconColor: string; bg: string }
> = {
  payment_ontime: {
    label: "Pago a tiempo",
    icon: CreditCard,
    iconColor: "text-green-600",
    bg: "bg-green-50",
  },
  pqr_created: {
    label: "Incidencia reportada",
    icon: MessageSquareWarning,
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
  },
  assembly_attended: {
    label: "Asistencia asamblea",
    icon: Users,
    iconColor: "text-purple-600",
    bg: "bg-purple-50",
  },
  reservation: {
    label: "Reserva de zona",
    icon: CalendarCheck,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
  },
  redeem_discount: {
    label: "Canje de descuento",
    icon: Gift,
    iconColor: "text-pink-600",
    bg: "bg-pink-50",
  },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} dias`;

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

export function TransactionHistory({
  transactions,
}: {
  transactions: PointTransaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-apple-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-7 w-7 text-gray-300" strokeWidth={1.5} />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-700">
          Sin movimientos aun
        </p>
        <p className="mt-1 text-[13px] text-gray-400">
          Tus puntos apareceran aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx, i) => {
        const config = reasonConfig[tx.reason] ?? reasonConfig.payment_ontime;
        const Icon = config.icon;
        const isEarn = tx.type === "earn";

        return (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 + i * 0.04,
              duration: 0.3,
              ease: "easeOut",
            }}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-apple-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
            >
              <Icon
                className={`h-5 w-5 ${config.iconColor}`}
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold tracking-tight text-gray-900">
                {config.label}
              </p>
              <p className="text-[11px] text-gray-400">
                {formatDate(tx.created_at)}
              </p>
            </div>
            <p
              className={`shrink-0 text-[15px] font-bold ${
                isEarn ? "text-green-500" : "text-red-400"
              }`}
            >
              {isEarn ? "+" : "-"}
              {tx.amount}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
