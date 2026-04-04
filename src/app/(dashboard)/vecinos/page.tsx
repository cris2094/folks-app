import Link from "next/link";
import {
  ChevronLeft,
  Users,
  Building2,
} from "lucide-react";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { getNeighbors } from "@/features/vecinos/queries/get-neighbors";
import { VecinosSearch } from "@/features/vecinos/components/vecinos-search";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default async function VecinosPage() {
  const neighbors = await getNeighbors();

  // Group by tower
  const towers = new Map<string, typeof neighbors>();
  for (const n of neighbors) {
    const key = n.tower || "Sin torre";
    if (!towers.has(key)) towers.set(key, []);
    towers.get(key)!.push(n);
  }

  // Sort towers
  const sortedTowers = Array.from(towers.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

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
              Vecinos
            </h1>
            <div className="w-8" />
          </div>
        </header>
      </FadeIn>

      {/* Stats */}
      <FadeInUp delay={0.05}>
        <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <Users className="h-4 w-4 text-amber-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{neighbors.length}</p>
            <p className="text-[10px] text-gray-500">Residentes</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-apple-sm">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <Building2 className="h-4 w-4 text-blue-600" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-gray-900">{towers.size}</p>
            <p className="text-[10px] text-gray-500">Torres</p>
          </div>
        </div>
      </FadeInUp>

      {/* Search + list (client component for interactivity) */}
      <FadeInUp delay={0.1}>
        <VecinosSearch
          neighbors={neighbors}
          sortedTowers={sortedTowers}
          getInitials={getInitials}
          getAvatarColor={getAvatarColor}
        />
      </FadeInUp>

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
