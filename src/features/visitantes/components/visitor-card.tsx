"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Car, ShieldX, Star } from "lucide-react";
import { revokeAccess } from "../actions/revoke-access";
import { useTransition } from "react";
import { relationshipLabels } from "../schemas/visitantes";

interface VisitorCardProps {
  id: string;
  fullName: string;
  documentNumber: string | null;
  reason: string | null;
  isFavorite: boolean;
  vehiclePlate: string | null;
  authorizedUntil: string | null;
  expiresAt: string | null;
  createdAt: string;
}

function isExpired(expiresAt: string | null, authorizedUntil: string | null) {
  const ref = expiresAt ?? authorizedUntil;
  if (!ref) return false;
  return new Date(ref) < new Date();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VisitorCard({
  id,
  fullName,
  documentNumber,
  reason,
  isFavorite,
  vehiclePlate,
  authorizedUntil,
  expiresAt,
  createdAt,
}: VisitorCardProps) {
  const [isPending, startTransition] = useTransition();
  const expired = isExpired(expiresAt, authorizedUntil);
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleRevoke() {
    const fd = new FormData();
    fd.set("visitor_id", id);
    startTransition(() => {
      revokeAccess(fd);
    });
  }

  return (
    <Card className="ring-1 ring-gray-100 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-amber-700">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {fullName}
                  </p>
                  {isFavorite && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                  )}
                </div>
                {documentNumber && (
                  <p className="text-xs text-gray-500">CC {documentNumber}</p>
                )}
              </div>
              <Badge
                variant={expired ? "destructive" : "secondary"}
                className={
                  expired
                    ? ""
                    : "bg-green-50 text-green-700"
                }
              >
                {expired ? "Expirado" : "Activo"}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
              {reason && (
                <span>{relationshipLabels[reason] ?? reason}</span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(createdAt)}
              </span>
              {vehiclePlate && (
                <span className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  {vehiclePlate}
                </span>
              )}
            </div>

            {!expired && (
              <button
                type="button"
                onClick={handleRevoke}
                disabled={isPending}
                className="mt-2.5 flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 active:bg-red-200 disabled:opacity-50"
              >
                <ShieldX className="h-3 w-3" />
                {isPending ? "Revocando..." : "Revocar"}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
