import { z } from "zod";

export const ticketCategories = [
  "maintenance",
  "noise",
  "security",
  "billing",
  "common_areas",
  "parking",
  "pets",
  "suggestion",
  "other",
] as const;

export const ticketPriorities = ["low", "medium", "high", "urgent"] as const;

export const createTicketSchema = z.object({
  category: z.enum(ticketCategories, {
    error: "Selecciona una categoria",
  }),
  priority: z.enum(ticketPriorities).default("medium"),
  subject: z
    .string()
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(150, "El titulo es muy largo"),
  description: z
    .string()
    .min(10, "La descripcion debe tener al menos 10 caracteres")
    .max(2000, "La descripcion es muy larga"),
});

export const sendMessageSchema = z.object({
  ticket_id: z.string().uuid("Ticket invalido"),
  message: z
    .string()
    .min(1, "El mensaje no puede estar vacio")
    .max(2000, "El mensaje es muy largo"),
});

export const rateTicketSchema = z.object({
  ticket_id: z.string().uuid("Ticket invalido"),
  rating: z.number().int().min(1).max(5),
});

export const updateTicketStatusSchema = z.object({
  ticket_id: z.string().uuid("Ticket invalido"),
  status: z.enum(["open", "in_progress", "resolved", "rated"]),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type RateTicketInput = z.infer<typeof rateTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
