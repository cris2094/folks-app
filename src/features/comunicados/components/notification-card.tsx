import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Receipt,
  Megaphone,
  DoorOpen,
  Waves,
  AlertTriangle,
} from "lucide-react";

const typeConfig: Record<
  string,
  { icon: typeof Package; color: string; bg: string }
> = {
  package: { icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
  payment: { icon: Receipt, color: "text-green-600", bg: "bg-green-50" },
  announcement: {
    icon: Megaphone,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  visitor: { icon: DoorOpen, color: "text-purple-600", bg: "bg-purple-50" },
  reservation: { icon: Waves, color: "text-cyan-600", bg: "bg-cyan-50" },
  pqr: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
};

interface NotificationCardProps {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export function NotificationCard({
  type,
  title,
  body,
  read,
  createdAt,
}: NotificationCardProps) {
  const t = typeConfig[type] ?? typeConfig.announcement;
  const Icon = t.icon;

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `hace ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `hace ${diffHours}h`;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  return (
    <Card className={!read ? "border-l-4 border-l-blue-500 bg-blue-50/20" : ""}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.bg}`}
          >
            <Icon className={`h-4 w-4 ${t.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm ${!read ? "font-semibold" : "text-muted-foreground font-medium"}`}
              >
                {title}
              </p>
              <span className="text-muted-foreground shrink-0 text-xs">
                {formatDate(createdAt)}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
              {body}
            </p>
          </div>
          {!read && (
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
