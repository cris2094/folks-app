"use client";

import { motion } from "framer-motion";
import { Trophy, Shield, Award, Crown } from "lucide-react";
import type { PointLevel } from "@/types/database";

const levelConfig: Record<
  PointLevel,
  {
    label: string;
    color: string;
    bgFrom: string;
    bgTo: string;
    iconBg: string;
    icon: typeof Trophy;
  }
> = {
  bronce: {
    label: "Bronce",
    color: "text-amber-700",
    bgFrom: "from-amber-800",
    bgTo: "to-amber-950",
    iconBg: "bg-amber-700/30",
    icon: Shield,
  },
  plata: {
    label: "Plata",
    color: "text-gray-300",
    bgFrom: "from-gray-600",
    bgTo: "to-gray-800",
    iconBg: "bg-gray-500/30",
    icon: Award,
  },
  oro: {
    label: "Oro",
    color: "text-yellow-300",
    bgFrom: "from-yellow-600",
    bgTo: "to-amber-800",
    iconBg: "bg-yellow-500/30",
    icon: Trophy,
  },
  platino: {
    label: "Platino",
    color: "text-purple-200",
    bgFrom: "from-purple-700",
    bgTo: "to-indigo-900",
    iconBg: "bg-purple-500/30",
    icon: Crown,
  },
};

interface PointsCardProps {
  points: number;
  level: PointLevel;
  totalEarned: number;
  nextLevel: string | null;
  nextThreshold: number;
  currentMin: number;
}

export function PointsCard({
  points,
  level,
  totalEarned,
  nextLevel,
  nextThreshold,
  currentMin,
}: PointsCardProps) {
  const config = levelConfig[level];
  const LevelIcon = config.icon;
  const progress =
    nextLevel && nextThreshold > currentMin
      ? Math.min(
          ((totalEarned - currentMin) / (nextThreshold - currentMin)) * 100,
          100,
        )
      : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.bgFrom} ${config.bgTo} p-6`}
    >
      {/* Subtle glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        {/* Level icon + label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.iconBg}`}
            >
              <LevelIcon
                className={`h-6 w-6 ${config.color}`}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white/60">
                Nivel {config.label}
              </p>
              <p className="text-xs text-white/40">
                {totalEarned} pts acumulados
              </p>
            </div>
          </div>
        </div>

        {/* Points number */}
        <div className="mt-5">
          <p className="text-[13px] text-white/50">Puntos disponibles</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="mt-1 text-5xl font-bold tracking-tight text-white"
          >
            {points.toLocaleString("es-CO")}
          </motion.p>
        </div>

        {/* Progress to next level */}
        {nextLevel && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-white/50">
                Progreso a {nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1)}
              </span>
              <span className="font-semibold text-white/70">
                {totalEarned}/{nextThreshold}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-white/40"
              />
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="mt-5">
            <p className="text-[12px] font-medium text-white/50">
              Has alcanzado el nivel maximo
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
