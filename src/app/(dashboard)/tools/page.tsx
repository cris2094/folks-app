import Link from "next/link";
import { getCurrentUser } from "@/features/auth/queries/get-current-user";
import { getAllToolsActions } from "@/lib/permissions";
import type { UserRole } from "@/types/database";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import { ChevronLeft } from "lucide-react";

export default async function ToolsPage() {
  const data = await getCurrentUser();
  const role = (data?.resident?.role ?? "residente") as UserRole;
  const tools = getAllToolsActions(role);

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-white">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3 px-5 pt-4 pb-2">
          <Link
            href="/home"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            Tools
          </h1>
        </div>
      </FadeIn>

      {/* App Grid */}
      <div className="px-5 pt-6 pb-8">
        <StaggerContainer className="grid grid-cols-4 gap-x-3 gap-y-6">
          {tools.map((tool) => (
            <StaggerItem key={tool.href + tool.label}>
              <Link
                href={tool.href}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200/60 shadow-sm transition-all duration-200 group-hover:shadow-md group-active:scale-90">
                  <tool.icon
                    className="h-6 w-6 text-gray-600"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-center text-[11px] font-medium leading-tight text-gray-500">
                  {tool.label}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Footer */}
      <div className="pb-24 pt-8 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-300">
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
