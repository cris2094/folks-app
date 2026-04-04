"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HealthScoreCircleProps {
  score: number;
  status: "green" | "yellow" | "red";
  size?: number;
}

const STATUS_COLORS = {
  green: { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.15)" },
  yellow: { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.15)" },
  red: { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.15)" },
};

export function HealthScoreCircle({
  score,
  status,
  size = 180,
}: HealthScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const colors = STATUS_COLORS[status];

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  // CountUp animation
  useEffect(() => {
    if (score === 0) {
      setDisplayScore(0);
      return;
    }

    let frame: number;
    const duration = 1200; // ms
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - fraction, 3);
      setDisplayScore(Math.round(eased * score));

      if (fraction < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span
          className="font-bold tracking-tight text-gray-900"
          style={{ fontSize: size * 0.28 }}
        >
          {displayScore}
        </span>
        <span
          className="font-medium text-gray-400"
          style={{ fontSize: size * 0.08 }}
        >
          de 100
        </span>
      </div>
    </div>
  );
}
