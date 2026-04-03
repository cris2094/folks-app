import { z } from "zod";

export const authorizeVisitorSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre es requerido")
    .max(100, "Maximo 100 caracteres"),
  document_number: z
    .string()
    .min(3, "Documento requerido")
    .max(20, "Maximo 20 caracteres"),
  phone: z.string().max(20).nullable().optional(),
  relationship: z.enum(["family", "friend", "service", "delivery"], {
    message: "Selecciona una relacion",
  }),
  access_date: z.string().min(1, "La fecha de acceso es requerida"),
  is_favorite: z.boolean().optional().default(false),
  is_temporary: z.boolean().optional().default(false),
  expires_at: z.string().nullable().optional(),
  vehicle_plate: z.string().max(10).nullable().optional(),
});

export type AuthorizeVisitorInput = z.infer<typeof authorizeVisitorSchema>;

export const frequentContactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es requerido")
    .max(100, "Maximo 100 caracteres"),
  document: z.string().max(20).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  relationship: z.enum(["family", "friend", "service", "delivery"], {
    message: "Selecciona una relacion",
  }),
  is_favorite: z.boolean().optional().default(false),
});

export type FrequentContactInput = z.infer<typeof frequentContactSchema>;

export const relationshipLabels: Record<string, string> = {
  family: "Familiar",
  friend: "Amigo",
  service: "Servicio",
  delivery: "Delivery",
};
