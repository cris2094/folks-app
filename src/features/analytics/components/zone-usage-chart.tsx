"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ZoneData {
  name: string;
  reservations: number;
  occupancyRate: number;
}

interface PeakHour {
  hour: string;
  count: number;
}

interface ZoneUsageChartProps {
  byZone: ZoneData[];
  peakHours: PeakHour[];
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "none",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
};

// Color scale for heatmap: low -> high
function getHeatColor(count: number, max: number): string {
  if (max === 0) return "#f1f5f9";
  const ratio = count / max;
  if (ratio > 0.75) return "#d97706";
  if (ratio > 0.5) return "#f59e0b";
  if (ratio > 0.25) return "#fbbf24";
  if (ratio > 0) return "#fef3c7";
  return "#f8fafc";
}

export function ZoneUsageChart({ byZone, peakHours }: ZoneUsageChartProps) {
  const hasZones = byZone.length > 0;
  const hasHours = peakHours.length > 0;
  const maxHourCount = Math.max(...peakHours.map((h) => h.count), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Horizontal bar chart: reservations by zone */}
      {hasZones ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Reservas por zona
          </p>
          <ResponsiveContainer width="100%" height={Math.max(120, byZone.length * 36)}>
            <BarChart
              data={byZone}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
              />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value} reservas (${props.payload.occupancyRate}% ocupacion)`,
                  "Zona",
                ]}
                contentStyle={tooltipStyle}
              />
              <Bar
                dataKey="reservations"
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          Sin datos de zonas
        </div>
      )}

      {/* Heatmap grid: peak hours */}
      {hasHours && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Horas pico
          </p>
          <div className="flex flex-wrap gap-1.5">
            {peakHours.map((h) => (
              <div
                key={h.hour}
                className="flex flex-col items-center rounded-lg px-2 py-1.5"
                style={{ backgroundColor: getHeatColor(h.count, maxHourCount) }}
              >
                <span className="text-[10px] font-medium text-gray-700">
                  {h.hour}
                </span>
                <span className="text-[10px] text-gray-500">{h.count}</span>
              </div>
            ))}
          </div>
          {/* Scale legend */}
          <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
            <span>Menos</span>
            <div className="h-2.5 w-4 rounded-sm bg-[#f8fafc]" />
            <div className="h-2.5 w-4 rounded-sm bg-[#fef3c7]" />
            <div className="h-2.5 w-4 rounded-sm bg-[#fbbf24]" />
            <div className="h-2.5 w-4 rounded-sm bg-[#f59e0b]" />
            <div className="h-2.5 w-4 rounded-sm bg-[#d97706]" />
            <span>Mas</span>
          </div>
        </div>
      )}
    </div>
  );
}
