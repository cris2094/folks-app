import { z } from "zod";

export const unitSchema = z.object({
  tower: z.string().min(1, "La torre es requerida"),
  apartment: z.string().min(1, "El apartamento es requerido"),
  cadastral_number: z.string().nullable().optional(),
  area_m2: z.number().positive().nullable().optional(),
  parking_spot: z.string().nullable().optional(),
  admin_fee_cop: z.number().min(0).default(0),
});

export const residentSchema = z.object({
  full_name: z.string().min(2, "El nombre es requerido"),
  document_type: z.enum(["cc", "ce", "passport"]),
  document_number: z.string().min(3, "El documento es requerido"),
  email: z.string().email("Correo invalido").nullable().optional(),
  phone: z.string().nullable().optional(),
  is_owner: z.boolean().default(false),
});

export const vehicleSchema = z.object({
  plate: z
    .string()
    .min(5, "La placa es requerida")
    .max(7, "Placa invalida")
    .toUpperCase(),
  type: z.enum(["car", "motorcycle", "bicycle"]),
  color: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  parking_spot: z.string().nullable().optional(),
});

export const petSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  species: z.enum(["dog", "cat", "other"]),
  breed: z.string().nullable().optional(),
  vaccination_up_to_date: z.boolean().default(false),
});

export type UnitInput = z.infer<typeof unitSchema>;
export type ResidentInput = z.infer<typeof residentSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type PetInput = z.infer<typeof petSchema>;
