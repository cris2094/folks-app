"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MorosityChartProps {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

const COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export function MorosityChart({
  highRisk,
  mediumRisk,
  lowRisk,
}: MorosityChartProps) {
  const data = [
    { name: "Alto riesgo", value: highRisk, color: COLORS.high },
    { name: "Medio riesgo", value: mediumRisk, color: COLORS.medium },
    { name: "Bajo riesgo", value: lowRisk, color: COLORS.low },
  ].filter((d) => d.value > 0);

  const total = highRisk + mediumRisk + lowRisk;

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-400">
        Sin datos de morosidad
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} unidades`, name]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-[10px] text-gray-500">unidades</p>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-2 flex justify-center gap-4">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-[11px] text-gray-600">
              {d.name} ({d.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
