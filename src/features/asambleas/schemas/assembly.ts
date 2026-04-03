import { z } from "zod";

export const createAssemblySchema = z.object({
  title: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(200, "Maximo 200 caracteres"),
  type: z.enum(["ordinaria", "extraordinaria"]),
  date: z.string().min(1, "La fecha es requerida"),
  location: z
    .string()
    .min(1, "El lugar es requerido")
    .max(200, "Maximo 200 caracteres"),
  president: z.string().optional(),
  secretary: z.string().optional(),
});

export type CreateAssemblyInput = z.infer<typeof createAssemblySchema>;
