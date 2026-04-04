"use client";

import { useState } from "react";

type TabValue = "activas" | "cerradas";

interface PollTabsProps {
  activasCount: number;
  cerradasCount: number;
  activasContent: React.ReactNode;
  cerradasContent: React.ReactNode;
}

export function PollTabs({
  activasCount,
  cerradasCount,
  activasContent,
  cerradasContent,
}: PollTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("activas");

  return (
    <>
      {/* Tabs pill */}
      <div className="px-5 pb-4">
        <div className="flex rounded-full bg-gray-100/80 p-1">
          <button
            onClick={() => setActiveTab("activas")}
            className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[13px] font-medium transition-all duration-200 ${
              activeTab === "activas"
                ? "bg-white text-gray-900 shadow-apple-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Activas ({activasCount})
          </button>
          <button
            onClick={() => setActiveTab("cerradas")}
            className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[13px] font-medium transition-all duration-200 ${
              activeTab === "cerradas"
                ? "bg-white text-gray-900 shadow-apple-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Cerradas ({cerradasCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-2">
        {activeTab === "activas" ? activasContent : cerradasContent}
      </div>
    </>
  );
}
