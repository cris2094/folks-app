"use client";

import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  BookOpen,
  Receipt,
  Scale,
  Download,
  Search,
  FolderOpen,
} from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

type DocCategory = "reglamento" | "manual" | "acta" | "presupuesto";

interface Document {
  id: string;
  name: string;
  category: DocCategory;
  date: string;
  size: string;
  description: string;
}

const CATEGORY_CONFIG: Record<
  DocCategory,
  { label: string; icon: LucideIcon; bg: string; text: string }
> = {
  reglamento: {
    label: "Reglamento",
    icon: Scale,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  manual: {
    label: "Manual",
    icon: BookOpen,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  acta: {
    label: "Acta",
    icon: FileText,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  presupuesto: {
    label: "Presupuesto",
    icon: Receipt,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
};

const DOCUMENTS_MOCK: Document[] = [
  {
    id: "1",
    name: "Reglamento de Propiedad Horizontal",
    category: "reglamento",
    date: "2024-01-15",
    size: "2.4 MB",
    description:
      "Reglamento general del conjunto residencial aprobado en asamblea",
  },
  {
    id: "2",
    name: "Manual de Convivencia",
    category: "manual",
    date: "2024-03-01",
    size: "1.8 MB",
    description:
      "Normas de convivencia para residentes y visitantes del conjunto",
  },
  {
    id: "3",
    name: "Manual de Uso Zonas Comunes",
    category: "manual",
    date: "2024-02-10",
    size: "980 KB",
    description:
      "Guia de uso y cuidado de las zonas comunes: piscina, BBQ, gimnasio",
  },
  {
    id: "4",
    name: "Acta Asamblea Ordinaria 2026",
    category: "acta",
    date: "2026-03-15",
    size: "3.1 MB",
    description: "Acta de la asamblea ordinaria de copropietarios 2026",
  },
  {
    id: "5",
    name: "Acta Asamblea Extraordinaria - Dic 2025",
    category: "acta",
    date: "2025-12-05",
    size: "1.5 MB",
    description: "Asamblea extraordinaria para aprobacion de obras",
  },
  {
    id: "6",
    name: "Presupuesto 2026",
    category: "presupuesto",
    date: "2026-01-01",
    size: "850 KB",
    description:
      "Presupuesto anual aprobado para la vigencia 2026",
  },
  {
    id: "7",
    name: "Estados Financieros Q1 2026",
    category: "presupuesto",
    date: "2026-03-31",
    size: "1.2 MB",
    description:
      "Balance general y estado de resultados primer trimestre 2026",
  },
  {
    id: "8",
    name: "Plan de Emergencias",
    category: "manual",
    date: "2024-06-20",
    size: "4.2 MB",
    description:
      "Protocolo de evacuacion y plan de emergencias del conjunto",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ManualesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocCategory | "all">("all");

  const filtered = DOCUMENTS_MOCK.filter((doc) => {
    const matchesSearch =
      search === "" ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || doc.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories: { value: DocCategory | "all"; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "reglamento", label: "Reglamentos" },
    { value: "manual", label: "Manuales" },
    { value: "acta", label: "Actas" },
    { value: "presupuesto", label: "Presupuesto" },
  ];

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white">
      {/* Header */}
      <FadeIn>
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Inicio
            </Link>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
              Manuales y Documentos
            </h1>
            <div className="w-8" />
          </div>
        </header>
      </FadeIn>

      {/* Search */}
      <FadeInUp delay={0.05}>
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>
      </FadeInUp>

      {/* Category filter */}
      <FadeInUp delay={0.1}>
        <div className="flex gap-2 overflow-x-auto px-5 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                filter === cat.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FadeInUp>

      {/* Documents list */}
      <div className="flex-1 px-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FolderOpen className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="font-medium text-gray-700">Sin resultados</p>
            <p className="text-[13px] text-gray-500">
              No se encontraron documentos con ese criterio
            </p>
          </div>
        ) : (
          <StaggerContainer className="space-y-3">
            {filtered.map((doc) => {
              const cc = CATEGORY_CONFIG[doc.category];
              const DocIcon = cc.icon;

              return (
                <StaggerItem key={doc.id}>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-apple-sm">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cc.bg}`}
                      >
                        <DocIcon className={`h-5 w-5 ${cc.text}`} strokeWidth={1.5} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-1">
                          {doc.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-gray-500">
                          {doc.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                          <span>{formatDate(doc.date)}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>{doc.size}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cc.bg} ${cc.text}`}
                          >
                            {cc.label}
                          </span>
                        </div>
                      </div>

                      {/* Download */}
                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <Download className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>

      {/* Footer */}
      <div className="pb-24 pt-8 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-medium tracking-wider text-gray-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
