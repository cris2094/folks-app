import { z } from "zod";

export const registerPackageSchema = z.object({
  unit_id: z.string().uuid("Selecciona una unidad"),
  description: z.string().min(1, "La descripcion es requerida").max(200),
  received_by: z.string().min(1, "Nombre de quien recibe es requerido"),
});

export type RegisterPackageInput = z.infer<typeof registerPackageSchema>;
