import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Phone, Smartphone } from "lucide-react";

export default function FolkyPage() {
  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Folky</h1>
            <p className="text-muted-foreground text-sm">
              Tu asistente del conjunto
            </p>
          </div>
          <Badge variant="default" className="ml-auto bg-green-500">
            En linea
          </Badge>
        </div>
      </header>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="rounded-lg rounded-tl-none bg-gray-100 p-3">
              <p className="text-sm">
                Hola! Soy Folky, el asistente de tu conjunto. Puedo ayudarte
                con:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Consultar tu saldo y pagos</li>
                <li>Reservar zonas sociales</li>
                <li>Estado de tus paquetes</li>
                <li>Informacion del reglamento</li>
                <li>Reportar incidencias</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Smartphone className="h-4 w-4" />
            WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            Folky tambien esta disponible por WhatsApp. Escribe al numero del
            conjunto y Folky te responde al instante.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              WhatsApp activo 24/7
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Acciones rapidas
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Mi saldo", icon: "cash" },
            { label: "Reservar zona", icon: "pool" },
            { label: "Mis paquetes", icon: "package" },
            { label: "Reportar queja", icon: "warning" },
            { label: "Horarios zonas", icon: "clock" },
            { label: "Contactar admin", icon: "phone" },
          ].map((action) => (
            <Card
              key={action.label}
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-center gap-2 p-3">
                <span className="text-xs font-medium">{action.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
