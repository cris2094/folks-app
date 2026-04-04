"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Bus,
  Heart,
  GraduationCap,
  Gamepad2,
  Building2,
  Zap,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import type { WalletSummary } from "../queries/get-wallet-summary";
import { addWalletTransaction } from "../actions/add-wallet-transaction";
import { setWalletBudget } from "../actions/set-wallet-budget";

const CATEGORIES = [
  { key: "administracion", label: "Administracion", icon: Building2, color: "#6366F1" },
  { key: "servicios", label: "Servicios", icon: Zap, color: "#F59E0B" },
  { key: "mercado", label: "Mercado", icon: ShoppingCart, color: "#10B981" },
  { key: "transporte", label: "Transporte", icon: Bus, color: "#3B82F6" },
  { key: "salud", label: "Salud", icon: Heart, color: "#EF4444" },
  { key: "educacion", label: "Educacion", icon: GraduationCap, color: "#8B5CF6" },
  { key: "entretenimiento", label: "Entretenimiento", icon: Gamepad2, color: "#EC4899" },
  { key: "otros", label: "Otros", icon: MoreHorizontal, color: "#6B7280" },
] as const;

function getCategoryMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
}

function formatCOP(n: number) {
  return `$${n.toLocaleString("es-CO")}`;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
}

interface WalletClientProps {
  initialData: WalletSummary;
  initialMonth: string;
}

export function WalletClient({ initialData, initialMonth }: WalletClientProps) {
  const [data, setData] = useState(initialData);
  const [month, setMonth] = useState(initialMonth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pieData = data.categories
    .filter((c) => c.total > 0)
    .map((c) => ({
      name: getCategoryMeta(c.category).label,
      value: c.total,
      color: getCategoryMeta(c.category).color,
    }));

  function changeMonth(delta: number) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    setMonth(newMonth);
    startTransition(async () => {
      const { getWalletSummary } = await import("../queries/get-wallet-summary");
      const fresh = await getWalletSummary(newMonth);
      setData(fresh);
    });
  }

  async function refreshData() {
    startTransition(async () => {
      const { getWalletSummary } = await import("../queries/get-wallet-summary");
      const fresh = await getWalletSummary(month);
      setData(fresh);
    });
  }

  const monthLabel = new Date(month + "-15").toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white px-5 pb-5 pt-6 shadow-sm">
        <p className="text-sm text-gray-400">Mi Wallet</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Gestiona tu presupuesto personal
        </p>

        {/* Month selector */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <p className="text-sm font-semibold capitalize text-gray-900">
            {monthLabel}
          </p>
          <button
            onClick={() => changeMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Balance card */}
      <div className="px-5 pt-5">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] p-5 shadow-lg">
          <p className="text-xs text-white/60">Balance del mes</p>
          <p className={`mt-1 text-3xl font-bold tracking-tight ${data.balance >= 0 ? "text-white" : "text-red-400"}`}>
            {formatCOP(data.balance)}
          </p>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/50">Ingresos</p>
                <p className="text-sm font-semibold text-green-400">
                  {formatCOP(data.totalIncome)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/50">Gastos</p>
                <p className="text-sm font-semibold text-red-400">
                  {formatCOP(data.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donut chart */}
      {pieData.length > 0 && (
        <div className="px-5 pt-6">
          <p className="mb-3 text-[15px] font-semibold tracking-tight text-gray-900">
            Gastos por categoria
          </p>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="flex-1 text-xs text-gray-600">
                      {entry.name}
                    </span>
                    <span className="text-xs font-medium text-gray-900">
                      {formatCOP(entry.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget progress */}
      {data.categories.length > 0 && (
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-semibold tracking-tight text-gray-900">
              Presupuesto del mes
            </p>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="text-xs font-medium text-amber-600 active:text-amber-700"
            >
              Editar
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
            {data.categories.map((cat) => {
              const meta = getCategoryMeta(cat.category);
              const Icon = meta.icon;
              const pct = Math.min(cat.percentage, 100);
              const isOver = cat.percentage > 100;
              return (
                <div key={cat.category} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: meta.color + "15" }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: meta.color }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {meta.label}
                      </p>
                      <p className={`text-xs font-medium ${isOver ? "text-red-500" : "text-gray-500"}`}>
                        {cat.budget > 0
                          ? `${formatCOP(cat.total)} / ${formatCOP(cat.budget)}`
                          : formatCOP(cat.total)}
                      </p>
                    </div>
                    {cat.budget > 0 && (
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isOver ? "#EF4444" : meta.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="px-5 pt-6 pb-32">
        <p className="mb-3 text-[15px] font-semibold tracking-tight text-gray-900">
          Ultimos movimientos
        </p>
        {data.transactions.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">
              Sin movimientos este mes
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
            {data.transactions.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              const Icon = meta.icon;
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: isIncome ? "#10B98115" : meta.color + "15" }}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                    ) : (
                      <Icon
                        className="h-5 w-5"
                        style={{ color: meta.color }}
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(tx.date)}{" "}
                      {tx.is_recurring && (
                        <span className="text-amber-500">- Recurrente</span>
                      )}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-semibold tabular-nums ${isIncome ? "text-green-600" : "text-gray-900"}`}
                  >
                    {isIncome ? "+" : "-"}{formatCOP(tx.amount_cop)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 transition-all active:scale-95 hover:bg-amber-600"
      >
        <Plus className="h-6 w-6 text-white" strokeWidth={2} />
      </button>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal
            month={month}
            onClose={() => setShowAddModal(false)}
            onSuccess={refreshData}
          />
        )}
      </AnimatePresence>

      {/* Budget Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <BudgetModal
            month={month}
            budgets={data.budgets}
            onClose={() => setShowBudgetModal(false)}
            onSuccess={refreshData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Add Transaction Modal ----

function AddTransactionModal({
  month,
  onClose,
  onSuccess,
}: {
  month: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("otros");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit() {
    const numAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError("Completa todos los campos");
      return;
    }
    startTransition(async () => {
      const result = await addWalletTransaction({
        type,
        category,
        description: description.trim(),
        amount_cop: numAmount,
        date,
        is_recurring: isRecurring,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
        onClose();
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Nuevo movimiento</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${type === "expense" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Gasto
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${type === "income" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Ingreso
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Monto (COP)
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Descripcion
          </label>
          <input
            type="text"
            placeholder="Ej: Mercado semanal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Category */}
        {type === "expense" && (
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white"
          />
        </div>

        {/* Recurring */}
        <label className="mb-5 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
          />
          <span className="text-sm text-gray-700">Gasto recurrente</span>
        </label>

        {error && (
          <p className="mb-3 text-xs text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-amber-600 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ---- Budget Modal ----

function BudgetModal({
  month,
  budgets,
  onClose,
  onSuccess,
}: {
  month: string;
  budgets: { category: string; budget_cop: number }[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const budgetMap: Record<string, string> = {};
  budgets.forEach((b) => {
    budgetMap[b.category] = String(b.budget_cop);
  });

  const [values, setValues] = useState<Record<string, string>>(budgetMap);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const entries = Object.entries(values).filter(
        ([, v]) => v && parseFloat(v) > 0,
      );
      for (const [category, val] of entries) {
        await setWalletBudget({
          category,
          budget_cop: parseFloat(val),
          month,
        });
      }
      onSuccess();
      onClose();
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Presupuesto del mes
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <label className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                <cat.icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                {cat.label}
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={values[cat.key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [cat.key]: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="mt-5 w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-amber-600 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar presupuesto"}
        </button>
      </motion.div>
    </motion.div>
  );
}
