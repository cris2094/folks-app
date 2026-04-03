import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const actividad = [
  {
    titulo: "Corte de agua programado",
    fecha: "2 abr 2026",
    autor: "Administracion",
    extracto: "Se realizara mantenimiento en la red hidraulica el sabado 5 de abril de 8 AM a 2 PM.",
    tipo: "Aviso",
  },
  {
    titulo: "Nueva normativa de mascotas",
    fecha: "30 mar 2026",
    autor: "Consejo",
    extracto: "Se aprobaron nuevas normas para el transito de mascotas en areas comunes.",
    tipo: "Normativa",
  },
];

const anuncios = [
  {
    titulo: "Asamblea General Ordinaria",
    fecha: "15 abr 2026",
    autor: "Administracion",
    extracto: "Se convoca a todos los propietarios a la asamblea anual. Salon comunal, 3:00 PM.",
    tipo: "Evento",
  },
  {
    titulo: "Inscripcion clases de yoga",
    fecha: "10 abr 2026",
    autor: "Bienestar",
    extracto: "Abiertas inscripciones para clases de yoga los martes y jueves a las 7 AM.",
    tipo: "Comunidad",
  },
];

export default function ComunicadosPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Comunicados</h1>
        <p className="text-muted-foreground text-sm">
          Noticias y anuncios de tu conjunto
        </p>
      </header>

      <Tabs defaultValue="actividad">
        <TabsList className="w-full">
          <TabsTrigger value="actividad" className="flex-1">
            Actividad
          </TabsTrigger>
          <TabsTrigger value="anuncios" className="flex-1">
            Anuncios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actividad" className="mt-4 space-y-3">
          {actividad.map((item) => (
            <Card key={item.titulo}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{item.titulo}</CardTitle>
                  <Badge variant="outline">{item.tipo}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2 text-xs">
                  {item.extracto}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.autor} - {item.fecha}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="anuncios" className="mt-4 space-y-3">
          {anuncios.map((item) => (
            <Card key={item.titulo}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{item.titulo}</CardTitle>
                  <Badge variant="secondary">{item.tipo}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2 text-xs">
                  {item.extracto}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.autor} - {item.fecha}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
