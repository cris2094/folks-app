import { LogIn, LogOut, ShieldX } from "lucide-react";
import type { AccessLogItem } from "../queries/get-access-log";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

const actionConfig: Record<
  string,
  { icon: typeof LogIn; color: string; bg: string; label: string }
> = {
  entry: {
    icon: LogIn,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Entrada",
  },
  exit: {
    icon: LogOut,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Salida",
  },
  denied: {
    icon: ShieldX,
    color: "text-red-600",
    bg: "bg-red-50",
    label: "Denegado",
  },
};

export function AccessTimeline({ logs }: { logs: AccessLogItem[] }) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <LogIn className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-gray-700">Sin historial</p>
          <p className="text-sm text-gray-500">
            Los registros de acceso apareceran aqui
          </p>
        </div>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, AccessLogItem[]> = {};
  for (const log of logs) {
    const key = formatDate(log.created_at);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  }

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {date}
          </p>
          <div className="space-y-1">
            {items.map((log) => {
              const config = actionConfig[log.action] ?? actionConfig.entry;
              const Icon = config.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {log.visitor_name ?? "Visitante"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {config.label}
                      {log.method !== "manual" && ` via ${log.method}`}
                      {log.notes && ` -- ${log.notes}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatTime(log.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
