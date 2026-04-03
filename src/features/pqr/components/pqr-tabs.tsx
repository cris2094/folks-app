"use client";

import { useState } from "react";

type TabValue = "en_proceso" | "cerradas";

interface PqrTabsProps {
  enProcesoCount: number;
  cerradasCount: number;
  enProcesoContent: React.ReactNode;
  cerradasContent: React.ReactNode;
}

export function PqrTabs({
  enProcesoCount,
  cerradasCount,
  enProcesoContent,
  cerradasContent,
}: PqrTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("en_proceso");

  return (
    <>
      {/* Tabs pill */}
      <div className="px-4 pb-4">
        <div className="flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("en_proceso")}
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition-all ${
              activeTab === "en_proceso"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            En Proceso ({enProcesoCount})
          </button>
          <button
            onClick={() => setActiveTab("cerradas")}
            className={`flex-1 rounded-full py-2 text-center text-sm font-medium transition-all ${
              activeTab === "cerradas"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Cerradas ({cerradasCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-2">
        {activeTab === "en_proceso" ? enProcesoContent : cerradasContent}
      </div>
    </>
  );
}
