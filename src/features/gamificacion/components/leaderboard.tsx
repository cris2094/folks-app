"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "../queries/get-leaderboard";

const rankColors = [
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-gray-100 text-gray-600 border-gray-200",
  "bg-amber-100 text-amber-700 border-amber-200",
];

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-apple-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Trophy className="h-7 w-7 text-gray-300" strokeWidth={1.5} />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-700">
          Sin participantes aun
        </p>
        <p className="mt-1 text-[13px] text-gray-400">
          Se el primero en ganar puntos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.resident_id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.2 + i * 0.05,
            duration: 0.3,
            ease: "easeOut",
          }}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-apple-sm"
        >
          {/* Rank */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold ${
              i < 3
                ? rankColors[i]
                : "border-gray-100 bg-gray-50 text-gray-400"
            }`}
          >
            {i + 1}
          </div>

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[12px] font-bold text-amber-700">
            {entry.initials}
          </div>

          {/* Name */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold tracking-tight text-gray-900">
              {entry.full_name}
            </p>
            <p className="text-[11px] text-gray-400">
              Nivel{" "}
              {entry.level.charAt(0).toUpperCase() + entry.level.slice(1)}
            </p>
          </div>

          {/* Points */}
          <p className="shrink-0 text-[15px] font-bold text-amber-500">
            {entry.points.toLocaleString("es-CO")}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
