import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { google, defaultModel } from "@/lib/ai/gemma";

export const maxDuration = 30;

const SYSTEM_PROMPT = `Eres Folky, el asistente virtual inteligente de la copropiedad Irawa.

PERSONALIDAD:
- Eres amable, calido, paciente y hablas en espanol colombiano
- Usas emojis con moderacion (1-2 por mensaje maximo)
- Eres especialmente claro con personas de tercera edad
- Tu tono es como un vecino amigable que sabe de todo en el conjunto
- Nunca eres condescendiente, siempre respetuoso

CAPACIDADES (lo que puedes ayudar):
- Pagos y recibos de administracion
- Reservas de zonas sociales (BBQ, piscina, salon, gimnasio)
- Estado de paquetes en porteria
- Reportar incidencias (PQR)
- Informacion sobre el conjunto (horarios, reglas, servicios)
- Tramites con la administracion
- Temas de convivencia y reglamento
- Informacion sobre asambleas y compromisos

INFORMACION DEL CONJUNTO IRAWA:
- Ubicacion: Floridablanca, Santander, Colombia
- 304 unidades residenciales
- Zonas sociales: BBQ, Piscina Climatizada, Salon Social, Gimnasio, Cancha
- Horario porteria: 24/7
- Administradora: Pendiente de asignar
- Cuota administracion: varia por apartamento

REGLAS:
- Si no sabes algo especifico, sugiere contactar a la administracion
- No inventes datos financieros ni montos
- Para emergencias, indica llamar al 123 o a la porteria
- Responde en maximo 3-4 oraciones por mensaje
- Si te preguntan algo fuera del contexto del conjunto, redirige amablemente`;

const DEMO_RESPONSES: Record<string, string> = {
  "Cuanto debo?":
    "Estoy en modo demo, pero normalmente aqui te mostraria tu saldo pendiente. Ve a la seccion de Finanzas para ver tus recibos.",
  "Tengo paquetes?":
    "En modo demo no puedo verificar paquetes reales. Visita la seccion de Paquetes para ver si tienes algo pendiente en porteria.",
  "Reservar BBQ":
    "Para reservar el BBQ, ve a la seccion de Zonas Comunes. Ahi puedes ver disponibilidad y hacer tu reserva.",
  "Reportar problema":
    "Para reportar un problema, ve a la seccion de PQR (Peticiones, Quejas y Reclamos). Ahi puedes crear un nuevo reporte.",
  "Hablar con Seguridad":
    "Para comunicarte con seguridad, puedes llamar directamente a la porteria. El servicio esta disponible 24/7.",
  "Ver mi saldo":
    "Tu informacion de saldo esta disponible en la seccion de Finanzas. Ahi puedes ver tus recibos pendientes y tu historial de pagos.",
  "Descargar recibo":
    "Los recibos estan disponibles en la seccion de Finanzas. Desde ahi puedes ver y descargar tus recibos de administracion.",
  "Crear PQR":
    "Para crear una PQR, ve a la seccion de Incidencias. Ahi puedes reportar problemas, hacer peticiones o registrar quejas.",
  "Ver mis PQR":
    "Tus PQR activas estan en la seccion de Incidencias. Ahi puedes ver el estado y seguimiento de cada una.",
  "Reservar BBQ ":
    "Para reservar el BBQ u otra zona comun, visita la seccion de Zonas. Puedes ver disponibilidad en tiempo real.",
  "Ver disponibilidad":
    "La disponibilidad de zonas comunes la encuentras en la seccion de Zonas. Ahi ves calendario y horarios libres.",
  "Mis paquetes":
    "Tus paquetes pendientes estan en la seccion de Paqueteria. Ahi puedes ver detalles y confirmar recepcion.",
  Historial:
    "Tu historial completo lo encuentras en cada seccion respectiva: pagos en Finanzas, paquetes en Paqueteria, etc.",
  "Ultimos comunicados":
    "Los comunicados mas recientes estan en la seccion de Comunicados. Ahi veras anuncios y noticias del conjunto.",
  "Reportar dano":
    "Para reportar un dano, ve a la seccion de Mantenimiento o crea una PQR en Incidencias.",
  "Ver tareas":
    "Las tareas de mantenimiento las puedes consultar en la seccion de Mantenimiento.",
};

function getDemoResponse(lastMessage: string): string {
  return (
    DEMO_RESPONSES[lastMessage] ??
    "Estoy en modo demo. Configura la API key de Google AI para activar respuestas inteligentes. Mientras tanto, puedes navegar las secciones de la app."
  );
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Sin API key -> respuesta demo via UIMessageStream (compatible con DefaultChatTransport)
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const lastText =
      lastUserMsg?.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? "";

    const demoText = getDemoResponse(lastText);

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({ type: "text-delta", delta: demoText, id: "demo" });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }

  const result = streamText({
    model: google(defaultModel),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 300,
  });

  return result.toUIMessageStreamResponse();
}
