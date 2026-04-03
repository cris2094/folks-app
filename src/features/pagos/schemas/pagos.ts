import { z } from "zod";

export const paymentFilterSchema = z.object({
  status: z.enum(["all", "pending", "paid", "overdue"]).default("all"),
});

export type PaymentFilter = z.infer<typeof paymentFilterSchema>;
