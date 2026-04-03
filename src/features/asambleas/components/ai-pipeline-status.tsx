"use client";

import {
  Upload,
  Mic,
  FileText,
  ListChecks,
  UserCheck,
  Globe,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Assembly, AssemblyStatus } from "@/types/database";
import { AudioUpload } from "./audio-upload";

interface AiPipelineStatusProps {
  assembly: Assembly;
}

interface PipelineStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "pending" | "processing" | "done";
}

function getSteps(assemblyStatus: AssemblyStatus): PipelineStep[] {
  const statusOrder: AssemblyStatus[] = [
    "scheduled",
    "in_progress",
    "transcribing",
    "generating",
    "review",
    "published",
  ];

  const currentIndex = statusOrder.indexOf(assemblyStatus);

  const steps: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    statusThreshold: number;
  }[] = [
    { id: "upload", label: "Upload audio", icon: Upload, statusThreshold: 1 },
    {
      id: "transcribe",
      label: "Transcripcion (Whisper)",
      icon: Mic,
      statusThreshold: 2,
    },
    {
      id: "generate",
      label: "Generacion de acta (Claude)",
      icon: FileText,
      statusThreshold: 3,
    },
    {
      id: "extract",
      label: "Extraccion de compromisos",
      icon: ListChecks,
      statusThreshold: 3,
    },
    {
      id: "review",
      label: "Revision del admin",
      icon: UserCheck,
      statusThreshold: 4,
    },
    {
      id: "publish",
      label: "Publicacion",
      icon: Globe,
      statusThreshold: 5,
    },
  ];

  return steps.map((step) => ({
    id: step.id,
    label: step.label,
    icon: step.icon,
    status:
      currentIndex > step.statusThreshold
        ? "done"
        : currentIndex === step.statusThreshold
          ? "processing"
          : "pending",
  }));
}

export function AiPipelineStatus({ assembly }: AiPipelineStatusProps) {
  const steps = getSteps(assembly.status);
  const showUpload =
    assembly.status === "scheduled" || assembly.status === "in_progress";

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-700">
          Pipeline IA
        </p>

        <div className="flex flex-col gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex items-center gap-2.5"
              >
                {/* Status icon */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    step.status === "done"
                      ? "bg-emerald-100"
                      : step.status === "processing"
                        ? "bg-amber-100"
                        : "bg-gray-100"
                  }`}
                >
                  {step.status === "done" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : step.status === "processing" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs ${
                    step.status === "done"
                      ? "font-medium text-emerald-700"
                      : step.status === "processing"
                        ? "font-medium text-amber-700"
                        : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Audio upload when in early stages */}
        {showUpload && !assembly.audio_url && (
          <div className="mt-1 border-t pt-3">
            <AudioUpload assemblyId={assembly.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
