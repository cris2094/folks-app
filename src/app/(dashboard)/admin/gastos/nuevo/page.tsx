import { ArrowLeft, Receipt } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/motion";
import Link from "next/link";
import { ExpenseForm } from "@/features/finanzas-admin/components/expense-form";

export default function NuevoGastoPage() {
  return (
    <FadeIn>
    <div className="mx-auto max-w-md p-4">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/gastos"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Receipt className="h-4 w-4 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold">Registrar Gasto</h1>
          </div>
        </div>
        <p className="ml-[3.75rem] mt-1 text-sm text-muted-foreground">
          Crear un nuevo registro de gasto
        </p>
      </header>

      <FadeInUp delay={0.1}>
      <ExpenseForm />
      </FadeInUp>

      <p className="pb-2 pt-8 text-center text-[10px] font-medium tracking-wider text-gray-300">
        POTENCIADO POR FOLKS
      </p>
    </div>
    </FadeIn>
  );
}
