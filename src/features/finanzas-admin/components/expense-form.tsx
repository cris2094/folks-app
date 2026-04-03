"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createExpense } from "../actions/create-expense";
import { createExpenseSchema } from "../schemas/expense";

const CATEGORIES = [
  { value: "maintenance", label: "Mantenimiento" },
  { value: "security", label: "Seguridad" },
  { value: "utilities", label: "Servicios publicos" },
  { value: "cleaning", label: "Aseo" },
  { value: "insurance", label: "Seguros" },
  { value: "payroll", label: "Nomina" },
  { value: "legal", label: "Legal" },
  { value: "reserve_fund", label: "Fondo de reserva" },
  { value: "extraordinary", label: "Extraordinario" },
  { value: "other", label: "Otros" },
] as const;

export function ExpenseForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Client-side validation
    const clientData = {
      category: formData.get("category") as string,
      subcategory: (formData.get("subcategory") as string) || undefined,
      description: formData.get("description") as string,
      amount_cop: Number(formData.get("amount_cop") || 0),
      expense_date: formData.get("expense_date") as string,
      vendor: (formData.get("vendor") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    const validation = createExpenseSchema.safeParse(clientData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0]?.toString();
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    startTransition(async () => {
      const result = await createExpense(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/admin/gastos"), 1200);
      }
    });
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <span className="text-2xl">OK</span>
          </div>
          <p className="font-semibold text-emerald-700">
            Gasto registrado exitosamente
          </p>
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-3 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-4 p-4">
          {/* Categoria */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              name="category"
              required
              className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Seleccionar...</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="text-xs text-destructive">
                {fieldErrors.category}
              </p>
            )}
          </div>

          {/* Subcategoria */}
          <div className="space-y-1.5">
            <Label htmlFor="subcategory">
              Subcategoria{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="subcategory"
              name="subcategory"
              placeholder="Ej: Plomeria, Electricidad..."
              className="h-11 rounded-xl"
            />
          </div>

          {/* Descripcion */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripcion</Label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              placeholder="Detalle del gasto..."
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {fieldErrors.description && (
              <p className="text-xs text-destructive">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Monto */}
          <div className="space-y-1.5">
            <Label htmlFor="amount_cop">Monto (COP)</Label>
            <Input
              id="amount_cop"
              name="amount_cop"
              type="number"
              required
              min={1}
              step={1}
              placeholder="150000"
              className="h-11 rounded-xl"
            />
            {fieldErrors.amount_cop && (
              <p className="text-xs text-destructive">
                {fieldErrors.amount_cop}
              </p>
            )}
          </div>

          {/* Fecha */}
          <div className="space-y-1.5">
            <Label htmlFor="expense_date">Fecha del gasto</Label>
            <Input
              id="expense_date"
              name="expense_date"
              type="date"
              required
              className="h-11 rounded-xl"
            />
            {fieldErrors.expense_date && (
              <p className="text-xs text-destructive">
                {fieldErrors.expense_date}
              </p>
            )}
          </div>

          {/* Proveedor */}
          <div className="space-y-1.5">
            <Label htmlFor="vendor">
              Proveedor{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="vendor"
              name="vendor"
              placeholder="Nombre del proveedor"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">
              Notas <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Notas adicionales..."
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-xl bg-amber-600 text-white shadow-md shadow-amber-600/25 hover:bg-amber-700"
        size="lg"
      >
        {isPending ? "Registrando..." : "Registrar Gasto"}
      </Button>
    </form>
  );
}
