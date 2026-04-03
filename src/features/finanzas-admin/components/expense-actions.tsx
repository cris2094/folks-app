"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveExpense } from "../actions/approve-expense";
import { markExpensePaid } from "../actions/mark-expense-paid";
import type { ExpenseStatus } from "@/types/database";

interface ExpenseActionsProps {
  expenseId: string;
  status: ExpenseStatus;
  hasFirstApproval: boolean;
}

export function ExpenseActions({
  expenseId,
  status,
  hasFirstApproval,
}: ExpenseActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleApprove() {
    setMessage(null);
    startTransition(async () => {
      const result = await approveExpense(expenseId, "approve");
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Aprobado exitosamente" });
      }
    });
  }

  function handleReject() {
    setMessage(null);
    startTransition(async () => {
      const result = await approveExpense(expenseId, "reject");
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Rechazado" });
      }
    });
  }

  function handleMarkPaid() {
    setMessage(null);
    startTransition(async () => {
      const result = await markExpensePaid(expenseId);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Marcado como pagado" });
      }
    });
  }

  return (
    <div className="space-y-2">
      {message && (
        <p
          className={`text-xs ${message.type === "error" ? "text-destructive" : "text-emerald-600"}`}
        >
          {message.text}
        </p>
      )}

      {status === "pending" && (
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={isPending}
            size="sm"
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isPending
              ? "..."
              : hasFirstApproval
                ? "Segunda Aprobacion"
                : "Aprobar"}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isPending}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            {isPending ? "..." : "Rechazar"}
          </Button>
        </div>
      )}

      {status === "approved" && (
        <Button
          onClick={handleMarkPaid}
          disabled={isPending}
          size="sm"
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {isPending ? "..." : "Marcar como Pagado"}
        </Button>
      )}
    </div>
  );
}
