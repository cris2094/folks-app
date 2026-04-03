import { z } from "zod";

export const reservationSchema = z.object({
  zone_id: z.string().uuid(),
  date: z.string().min(1, "La fecha es requerida"),
  start_time: z.string().min(1, "La hora de inicio es requerida"),
  end_time: z.string().min(1, "La hora de fin es requerida"),
  guests_count: z.number().int().min(0).max(50, "Maximo 50 invitados"),
  notes: z.string().nullable().optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
