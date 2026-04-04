"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Flag,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import type { BadgeWithStatus } from "../queries/get-my-badges";

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  flag: Flag,
  calendar: Calendar,
  users: Users,
  star: Star,
};

export function BadgesGrid({ badges }: { badges: BadgeWithStatus[] }) {
  if (badges.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-apple-sm">
        <p className="text-sm text-gray-400">
          Los badges estaran disponibles pronto
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {badges.map((badge, i) => {
        const Icon = iconMap[badge.icon] ?? Star;
        const earned = badge.earned;

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3 + i * 0.06,
              duration: 0.4,
              ease: "easeOut",
            }}
            className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
              earned
                ? "border-amber-200 bg-amber-50/50 shadow-apple-sm"
                : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                earned ? "bg-amber-100" : "bg-gray-100"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  earned ? "text-amber-600" : "text-gray-300"
                }`}
                strokeWidth={1.5}
              />
            </div>
            <p
              className={`mt-2 text-[11px] font-semibold leading-tight ${
                earned ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {badge.name}
            </p>
            {earned && (
              <p className="mt-1 text-[10px] font-medium text-amber-500">
                +{badge.points_reward} pts
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
