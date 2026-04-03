import { z } from "zod";

export const createExpenseSchema = z.object({
  category: z.enum([
    "maintenance",
    "security",
    "utilities",
    "cleaning",
    "insurance",
    "payroll",
    "legal",
    "reserve_fund",
    "extraordinary",
    "other",
  ]),
  subcategory: z.string().optional(),
  description: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(500, "Maximo 500 caracteres"),
  amount_cop: z.number().positive("Debe ser mayor a 0"),
  expense_date: z.string().min(1, "La fecha es requerida"),
  vendor: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
