"use client";

import { useState } from "react";

type TabValue = "pending" | "in_progress" | "completed";

interface TareasTabsProps {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  pendingContent: React.ReactNode;
  inProgressContent: React.ReactNode;
  completedContent: React.ReactNode;
}

export function TareasTabs({
  pendingCount,
  inProgressCount,
  completedCount,
  pendingContent,
  inProgressContent,
  completedContent,
}: TareasTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("pending");

  const tabs: { value: TabValue; label: string; count: number }[] = [
    { value: "pending", label: "Pendientes", count: pendingCount },
    { value: "in_progress", label: "En Progreso", count: inProgressCount },
    { value: "completed", label: "Completadas", count: completedCount },
  ];

  return (
    <>
      {/* Tabs pill - scrollable for 3 tabs */}
      <div className="pb-4">
        <div className="flex rounded-full bg-gray-100/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[12px] font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-white text-gray-900 shadow-apple-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-2">
        {activeTab === "pending" && pendingContent}
        {activeTab === "in_progress" && inProgressContent}
        {activeTab === "completed" && completedContent}
      </div>
    </>
  );
}
