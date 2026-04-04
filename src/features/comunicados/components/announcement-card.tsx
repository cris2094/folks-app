import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pin,
  Megaphone,
  Wrench,
  Receipt,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import type { AnnouncementItem } from "../queries/get-announcements";

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Megaphone; color: string }
> = {
  general: { label: "General", icon: Megaphone, color: "text-blue-500" },
  maintenance: {
    label: "Mantenimiento",
    icon: Wrench,
    color: "text-orange-500",
  },
  billing: { label: "Facturacion", icon: Receipt, color: "text-green-500" },
  event: { label: "Evento", icon: Calendar, color: "text-purple-500" },
  emergency: {
    label: "Emergencia",
    icon: AlertTriangle,
    color: "text-red-500",
  },
};

export function AnnouncementCard({
  announcement,
}: {
  announcement: AnnouncementItem;
}) {
  const cat = categoryConfig[announcement.category] ?? categoryConfig.general;
  const CatIcon = cat.icon;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className={`shadow-sm transition-shadow duration-200 hover:shadow-md ${announcement.is_pinned ? "border-amber-200 bg-amber-50/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
            <CatIcon className={`h-5 w-5 ${cat.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {announcement.is_pinned && (
                    <Pin className="h-3 w-3 text-amber-500" />
                  )}
                  <p className="truncate text-sm font-semibold">
                    {announcement.title}
                  </p>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {formatDate(announcement.created_at)}
                  {announcement.created_by_name &&
                    ` · ${announcement.created_by_name}`}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs">
                {cat.label}
              </Badge>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-gray-700">
              {announcement.body}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
