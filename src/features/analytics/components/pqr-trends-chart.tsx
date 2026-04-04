"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PqrCategoryData {
  category: string;
  count: number;
  avgResolutionDays: number;
}

interface MonthlyTrend {
  month: string;
  count: number;
}

interface PqrTrendsChartProps {
  byCategory: PqrCategoryData[];
  monthlyTrend: MonthlyTrend[];
}

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  border: "none",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
};

export function PqrTrendsChart({
  byCategory,
  monthlyTrend,
}: PqrTrendsChartProps) {
  const hasCategories = byCategory.length > 0;
  const hasTrend = monthlyTrend.length > 0;

  // Format month labels: "2025-03" -> "Mar"
  const trendData = monthlyTrend.map((d) => ({
    ...d,
    label: new Date(d.month + "-01").toLocaleDateString("es-CO", {
      month: "short",
    }),
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Bar chart: incidents by category */}
      {hasCategories ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Incidencias por categoria
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={byCategory.slice(0, 6)}
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
                dataKey="category"
                tick={{ fontSize: 11 }}
                width={90}
              />
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value} tickets (${props.payload.avgResolutionDays}d prom.)`,
                  "Incidencias",
                ]}
                contentStyle={tooltipStyle}
              />
              <Bar
                dataKey="count"
                fill="#f59e0b"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          Sin datos de categorias
        </div>
      )}

      {/* Line chart: monthly trend */}
      {hasTrend ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Tendencia mensual
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={trendData}
              margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip
                formatter={(value) => [`${value} tickets`, "PQR"]}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
                activeDot={{ r: 5, fill: "#d97706" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center text-sm text-gray-400">
          Sin datos de tendencia
        </div>
      )}
    </div>
  );
}
