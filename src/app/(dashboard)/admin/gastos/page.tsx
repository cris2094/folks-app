import { Receipt, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getExpenses } from "@/features/finanzas-admin/queries/get-expenses";
import type { ExpenseStatus, ExpenseCategory } from "@/types/database";

function formatCOP(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<
  ExpenseStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendiente" },
  approved: { bg: "bg-blue-100", text: "text-blue-800", label: "Aprobado" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rechazado" },
  paid: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Pagado" },
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  maintenance: "Mantenimiento",
  security: "Seguridad",
  utilities: "Servicios",
  cleaning: "Aseo",
  insurance: "Seguros",
  payroll: "Nomina",
  legal: "Legal",
  reserve_fund: "Fondo Reserva",
  extraordinary: "Extraordinario",
  other: "Otro",
};

interface GastosPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

export default async function GastosPage({ searchParams }: GastosPageProps) {
  const params = await searchParams;

  const filters: {
    category?: ExpenseCategory;
    status?: ExpenseStatus;
  } = {};

  if (params.category) {
    filters.category = params.category as ExpenseCategory;
  }
  if (params.status) {
    filters.status = params.status as ExpenseStatus;
  }

  const { data: expenses, count } = await getExpenses({
    ...filters,
    limit: 50,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Gastos</h2>
          <p className="text-xs text-muted-foreground">{count} registros</p>
        </div>
        <Link
          href="/admin/gastos"
          className="flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700"
        >
          <Plus className="h-4 w-4" />
          Registrar Gasto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterPill
          label="Todos"
          href="/admin/gastos"
          active={!params.status}
        />
        <FilterPill
          label="Pendientes"
          href="/admin/gastos?status=pending"
          active={params.status === "pending"}
        />
        <FilterPill
          label="Aprobados"
          href="/admin/gastos?status=approved"
          active={params.status === "approved"}
        />
        <FilterPill
          label="Pagados"
          href="/admin/gastos?status=paid"
          active={params.status === "paid"}
        />
        <FilterPill
          label="Rechazados"
          href="/admin/gastos?status=rejected"
          active={params.status === "rejected"}
        />
      </div>

      {/* Lista de gastos */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <Receipt className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-sm text-muted-foreground">
            No hay gastos con estos filtros
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {expenses.map((expense) => {
            const statusStyle = STATUS_STYLES[expense.status];
            const categoryLabel =
              CATEGORY_LABELS[expense.category] || expense.category;

            return (
              <Card key={expense.id} size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {expense.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(expense.expense_date)}
                        {expense.vendor && ` - ${expense.vendor}`}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold">
                      {formatCOP(Number(expense.amount_cop))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                      {categoryLabel}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>
                    {expense.requested_by_resident && (
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {expense.requested_by_resident.full_name}
                      </span>
                    )}
                  </div>

                  {/* Acciones para gastos pendientes */}
                  {expense.status === "pending" && (
                    <div className="flex gap-2 border-t pt-2">
                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-emerald-50 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-red-50 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-brand-dark text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}
