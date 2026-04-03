import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoorOpen, Clock, LogOut, User, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface VisitorItem {
  id: string;
  full_name: string;
  reason: string | null;
  is_favorite: boolean;
  arrived_at: string | null;
  left_at: string | null;
  created_at: string;
  unit: { tower: string; apartment: string }[] | null;
}

async function getVisitors(): Promise<VisitorItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: residents } = await supabase
    .from("residents")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!residents?.length) return [];
  const unitIds = residents.map((r) => r.unit_id);

  const { data } = await supabase
    .from("visitors")
    .select(`
      id, full_name, reason, is_favorite,
      arrived_at, left_at, created_at,
      unit:units (tower, apartment)
    `)
    .in("unit_id", unitIds)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as unknown as VisitorItem[]) ?? [];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function VisitantesPage() {
  const visitors = await getVisitors();

  const inBuilding = visitors.filter((v) => v.arrived_at && !v.left_at);
  const history = visitors.filter((v) => v.left_at);

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Visitantes</h1>
        <p className="text-muted-foreground text-sm">
          Control de acceso de visitantes
        </p>
      </header>

      <Tabs defaultValue="en-conjunto">
        <TabsList className="w-full">
          <TabsTrigger value="en-conjunto" className="flex-1">
            En el conjunto ({inBuilding.length})
          </TabsTrigger>
          <TabsTrigger value="historial" className="flex-1">
            Historial ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-conjunto" className="mt-4">
          {inBuilding.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Shield className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Sin visitantes</p>
                <p className="text-muted-foreground text-sm">
                  No hay visitantes en el conjunto en este momento
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {inBuilding.map((v) => {
                const unit = Array.isArray(v.unit) ? v.unit[0] : v.unit;
                return (
                  <Card key={v.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                          <DoorOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{v.full_name}</p>
                              {unit && (
                                <p className="text-muted-foreground text-xs">
                                  {unit.tower} - Apto {unit.apartment}
                                </p>
                              )}
                            </div>
                            <Badge variant="default" className="text-xs">En conjunto</Badge>
                          </div>
                          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                            {v.arrived_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Llegada: {formatDate(v.arrived_at)}
                              </span>
                            )}
                            {v.reason && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {v.reason}
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
          )}
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <DoorOpen className="h-8 w-8 text-gray-400" />
              <p className="text-muted-foreground text-sm">Sin historial de visitas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((v) => {
                const unit = Array.isArray(v.unit) ? v.unit[0] : v.unit;
                return (
                  <Card key={v.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{v.full_name}</p>
                          <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                            {unit && <span>{unit.tower} - {unit.apartment}</span>}
                            {v.reason && <span>{v.reason}</span>}
                          </div>
                          <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                            {v.arrived_at && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {formatDate(v.arrived_at)}
                              </span>
                            )}
                            {v.left_at && (
                              <span className="flex items-center gap-1">
                                <LogOut className="h-3 w-3" /> {formatDate(v.left_at)}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
