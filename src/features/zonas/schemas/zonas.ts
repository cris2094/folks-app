import { z } from "zod";

export const reservationSchema = z
  .object({
    zone_id: z.string().uuid(),
    date: z
      .string()
      .min(1, "La fecha es requerida")
      .refine(
        (d) => new Date(d) >= new Date(new Date().toISOString().split("T")[0]),
        "La fecha debe ser hoy o en el futuro",
      ),
    start_time: z
      .string()
      .min(1, "La hora de inicio es requerida")
      .regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
    end_time: z
      .string()
      .min(1, "La hora de fin es requerida")
      .regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
    guests_count: z.number().int().min(0).max(50, "Maximo 50 invitados"),
    notes: z.string().nullable().optional(),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "La hora de inicio debe ser anterior a la de fin",
    path: ["end_time"],
  });

export type ReservationInput = z.infer<typeof reservationSchema>;
