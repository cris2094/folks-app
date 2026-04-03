import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Star, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface TicketItem {
  id: string;
  category: string;
  subject: string;
  status: string;
  rating: number | null;
  created_at: string;
  resolved_at: string | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  open: { label: "Abierto", variant: "destructive", icon: AlertTriangle },
  in_progress: { label: "En proceso", variant: "secondary", icon: Clock },
  resolved: { label: "Resuelto", variant: "default", icon: CheckCircle },
  rated: { label: "Calificado", variant: "outline", icon: Star },
};

const categoryLabels: Record<string, string> = {
  maintenance: "Mantenimiento",
  noise: "Ruido",
  security: "Seguridad",
  billing: "Facturacion",
  suggestion: "Sugerencia",
  other: "Otro",
};

async function getMyTickets(): Promise<TicketItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: residents } = await supabase
    .from("residents")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return [];
  const residentIds = residents.map((r) => r.id);

  const { data } = await supabase
    .from("tickets")
    .select("id, category, subject, status, rating, created_at, resolved_at")
    .in("resident_id", residentIds)
    .order("created_at", { ascending: false })
    .limit(30);

  return (data as TicketItem[]) ?? [];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PqrPage() {
  const tickets = await getMyTickets();

  const active = tickets.filter((t) => t.status === "open" || t.status === "in_progress");
  const closed = tickets.filter((t) => t.status === "resolved" || t.status === "rated");

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">PQR</h1>
        <p className="text-muted-foreground text-sm">
          Peticiones, quejas y reclamos
        </p>
      </header>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-700">Sin solicitudes</p>
            <p className="text-muted-foreground text-sm">
              Tus peticiones y reclamos aparecerán aqui
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {active.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                Activos ({active.length})
              </h2>
              <div className="space-y-2">
                {active.map((ticket) => {
                  const s = statusConfig[ticket.status] ?? statusConfig.open;
                  const StatusIcon = s.icon;
                  return (
                    <Card key={ticket.id} className="border-l-4 border-l-orange-400">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                            <StatusIcon className="h-5 w-5 text-orange-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm">{ticket.subject}</p>
                              <Badge variant={s.variant} className="shrink-0 text-xs">
                                {s.label}
                              </Badge>
                            </div>
                            <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[ticket.category] ?? ticket.category}
                              </Badge>
                              <span>{formatDate(ticket.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {closed.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                Cerrados ({closed.length})
              </h2>
              <div className="space-y-2">
                {closed.map((ticket) => {
                  const s = statusConfig[ticket.status] ?? statusConfig.resolved;
                  const StatusIcon = s.icon;
                  return (
                    <Card key={ticket.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <StatusIcon className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muted-foreground">
                              {ticket.subject}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {categoryLabels[ticket.category] ?? ticket.category}
                              </span>
                              <span>{formatDate(ticket.created_at)}</span>
                              {ticket.rating && (
                                <span className="flex items-center gap-0.5">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {ticket.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
