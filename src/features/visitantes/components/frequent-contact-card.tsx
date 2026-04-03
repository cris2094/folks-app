"use client";

import Link from "next/link";
import { Star, Zap } from "lucide-react";
import { relationshipLabels } from "../schemas/visitantes";
import type { FrequentContactItem } from "../queries/get-frequent-contacts";

export function FrequentContactCard({
  contact,
}: {
  contact: FrequentContactItem;
}) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-gray-100 shadow-sm">
      {/* Avatar */}
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-base font-bold text-amber-700">
          {initials}
        </div>
        {contact.is_favorite && (
          <Star className="absolute -right-1 -top-1 h-4 w-4 fill-amber-400 text-amber-400" />
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {contact.name}
        </p>
        {contact.relationship && (
          <p className="mt-0.5 text-xs text-gray-500">
            {relationshipLabels[contact.relationship] ?? contact.relationship}
          </p>
        )}
      </div>

      <Link
        href={`/visitantes/autorizar?name=${encodeURIComponent(contact.name)}&document=${encodeURIComponent(contact.document ?? "")}&phone=${encodeURIComponent(contact.phone ?? "")}&relationship=${encodeURIComponent(contact.relationship ?? "")}`}
        className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
      >
        <Zap className="h-3 w-3" />
        Autorizar
      </Link>
    </div>
  );
}
