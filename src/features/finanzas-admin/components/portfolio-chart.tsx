"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AgingData {
  overdue_0_30: number;
  overdue_31_60: number;
  overdue_61_90: number;
  overdue_90_plus: number;
}

interface PortfolioChartProps {
  aging: AgingData;
}

const COLORS = ["#fbbf24", "#f97316", "#ef4444", "#991b1b"];

const LABELS: Record<string, string> = {
  "0-30 dias": "0-30 dias",
  "31-60 dias": "31-60 dias",
  "61-90 dias": "61-90 dias",
  "90+ dias": "90+ dias",
};

export function PortfolioChart({ aging }: PortfolioChartProps) {
  const data = [
    { name: "0-30 dias", value: aging.overdue_0_30 },
    { name: "31-60 dias", value: aging.overdue_31_60 },
    { name: "61-90 dias", value: aging.overdue_61_90 },
    { name: "90+ dias", value: aging.overdue_90_plus },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Sin cartera morosa
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={COLORS[index % COLORS.length]}
              stroke="none"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            Number(value).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }),
          ]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
