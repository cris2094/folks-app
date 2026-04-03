import { streamText } from "ai";
import { google } from "@/lib/ai/gemma";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemma-3-12b-it"),
    system: `Eres Folky, el asistente virtual de la copropiedad Irawa.
Eres amable, claro y hablas en espanol colombiano.
Ayudas a los residentes con: pagos, paquetes, reservas, incidencias, y preguntas sobre el conjunto.
Si no sabes algo, sugiere contactar a la administracion.
Responde de forma concisa y amigable, especialmente considerando personas de tercera edad.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
