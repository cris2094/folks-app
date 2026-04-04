"use client";

import { useState } from "react";
import { Search, Building2, Users } from "lucide-react";
import type { Neighbor } from "@/features/vecinos/queries/get-neighbors";

interface VecinosSearchProps {
  neighbors: Neighbor[];
  sortedTowers: [string, Neighbor[]][];
  getInitials: (name: string) => string;
  getAvatarColor: (name: string) => string;
}

export function VecinosSearch({
  neighbors,
  sortedTowers,
  getInitials,
  getAvatarColor,
}: VecinosSearchProps) {
  const [search, setSearch] = useState("");

  const filteredTowers = sortedTowers
    .map(([tower, residents]) => {
      const filtered = residents.filter((r) => {
        if (search === "") return true;
        const q = search.toLowerCase();
        return (
          r.full_name.toLowerCase().includes(q) ||
          r.apartment.toLowerCase().includes(q) ||
          tower.toLowerCase().includes(q)
        );
      });
      return [tower, filtered] as [string, Neighbor[]];
    })
    .filter(([, residents]) => residents.length > 0);

  return (
    <>
      {/* Search */}
      <div className="px-5 pb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o apartamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-5">
        {filteredTowers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="font-medium text-gray-700">Sin resultados</p>
            <p className="text-[13px] text-gray-500">
              No se encontraron vecinos con ese criterio
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTowers.map(([tower, residents]) => (
              <div key={tower}>
                {/* Tower header */}
                <div className="mb-3 flex items-center gap-2">
                  <Building2
                    className="h-4 w-4 text-gray-400"
                    strokeWidth={2}
                  />
                  <h2 className="text-[14px] font-semibold text-gray-900">
                    Torre {tower}
                  </h2>
                  <span className="text-[11px] text-gray-400">
                    ({residents.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {residents.map((neighbor) => (
                    <div
                      key={neighbor.id}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-apple-sm"
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getAvatarColor(neighbor.full_name)}`}
                      >
                        <span className="text-[13px] font-bold">
                          {getInitials(neighbor.full_name)}
                        </span>
                      </div>

                      {/* Info - NO phone/email per Ley 1581 */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-1">
                          {neighbor.full_name}
                        </h3>
                        <p className="text-[12px] text-gray-400">
                          Torre {neighbor.tower} - Apto {neighbor.apartment}
                          {neighbor.is_owner && (
                            <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                              Propietario
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
