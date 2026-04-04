import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Bell } from "lucide-react";
import { getAnnouncements } from "@/features/comunicados/queries/get-announcements";
import {
  getNotifications,
  getUnreadCount,
} from "@/features/comunicados/queries/get-notifications";
import { AnnouncementCard } from "@/features/comunicados/components/announcement-card";
import { NotificationCard } from "@/features/comunicados/components/notification-card";
import { FadeIn, FadeInUp } from "@/components/motion";

export default async function ComunicadosPage() {
  const [announcements, notifications, unreadCount] = await Promise.all([
    getAnnouncements(),
    getNotifications(),
    getUnreadCount(),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 pb-24">
      <FadeIn>
        <header className="mb-6 pt-2">
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Comunicados</h1>
          <p className="text-sm text-gray-500">
            Noticias y notificaciones del conjunto
          </p>
        </header>
      </FadeIn>

      <FadeInUp delay={0.1}>
      <Tabs defaultValue="actividad">
        <TabsList className="w-full rounded-full bg-gray-100/80 border border-gray-200 p-1 h-auto">
          <TabsTrigger value="actividad" className="flex-1 gap-1.5 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200">
            <Bell className="h-3.5 w-3.5" />
            Actividad
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 min-w-5 px-1 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="anuncios" className="flex-1 gap-1.5 rounded-full py-2 text-[13px] font-medium data-active:bg-white data-active:shadow-sm data-active:text-gray-900 transition-all duration-200">
            <Megaphone className="h-3.5 w-3.5" />
            Anuncios ({announcements.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="actividad" className="mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Sin notificaciones</p>
                <p className="text-muted-foreground text-sm">
                  Aqui veras la actividad de tu conjunto
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  id={n.id}
                  type={n.type}
                  title={n.title}
                  body={n.body}
                  read={n.read}
                  createdAt={n.created_at}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="anuncios" className="mt-4">
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Megaphone className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Sin comunicados</p>
                <p className="text-muted-foreground text-sm">
                  Los anuncios del conjunto apareceran aqui
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </FadeInUp>

      <div className="pb-2 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
