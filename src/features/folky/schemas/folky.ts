import { z } from "zod";

export const whatsappMessageSchema = z.object({
  from: z.string().min(10, "Numero invalido"),
  text: z.string().min(1, "Mensaje vacio"),
});

export type WhatsAppMessage = z.infer<typeof whatsappMessageSchema>;
