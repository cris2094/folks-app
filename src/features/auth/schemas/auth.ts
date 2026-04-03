import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electronico invalido"),
  password: z
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es muy largo"),
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electronico invalido"),
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayuscula")
    .regex(/[0-9]/, "Debe contener al menos un numero"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contrasenas no coinciden",
  path: ["confirmPassword"],
});

export const recoverySchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electronico invalido"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RecoveryInput = z.infer<typeof recoverySchema>;
