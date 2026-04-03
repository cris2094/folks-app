"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type {
  Assembly,
  AssemblyAttendee,
  AgendaItem,
} from "@/types/database";
import type { CommitmentWithUnit } from "@/features/asambleas/queries/get-assembly-detail";
import { AiPipelineStatus } from "./ai-pipeline-status";
import { GenerateMinutesButton } from "./generate-minutes-button";
import { CommitmentsBoard } from "./commitments-board";

/** Attendee with joined unit data from the query */
interface AttendeeWithUnit extends AssemblyAttendee {
  unit?: { tower: string; apartment: string } | null;
}

interface AssemblyDetailTabsProps {
  assembly: Assembly;
  attendees: AttendeeWithUnit[];
  agendaItems: AgendaItem[];
  commitments: CommitmentWithUnit[];
}

const ROLE_LABELS: Record<string, string> = {
  owner: "Propietario",
  delegate: "Delegado",
  tenant: "Inquilino",
};

export function AssemblyDetailTabs({
  assembly,
  attendees,
  agendaItems,
  commitments,
}: AssemblyDetailTabsProps) {
  return (
    <Tabs defaultValue="acta">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="acta">Acta</TabsTrigger>
        <TabsTrigger value="asistentes">
          Asistentes ({attendees.length})
        </TabsTrigger>
        <TabsTrigger value="agenda">
          Agenda ({agendaItems.length})
        </TabsTrigger>
        <TabsTrigger value="compromisos">
          Compromisos ({commitments.length})
        </TabsTrigger>
      </TabsList>

      {/* Tab: Acta */}
      <TabsContent value="acta">
        <div className="flex flex-col gap-4 pt-3">
          <AiPipelineStatus assembly={assembly} />

          {assembly.minutes_html ? (
            <>
              <Card size="sm">
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: assembly.minutes_html,
                    }}
                  />
                </CardContent>
              </Card>
              <GenerateMinutesButton
                assemblyId={assembly.id}
                hasMinutes
              />
            </>
          ) : (
            <GenerateMinutesButton
              assemblyId={assembly.id}
              hasMinutes={false}
            />
          )}
        </div>
      </TabsContent>

      {/* Tab: Asistentes */}
      <TabsContent value="asistentes">
        <div className="flex flex-col gap-2 pt-3">
          {attendees.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay asistentes registrados
            </p>
          ) : (
            attendees.map((attendee) => {
              const unitLabel = attendee.unit
                ? `${attendee.unit.tower}-${attendee.unit.apartment}`
                : "Sin unidad";

              return (
                <Card key={attendee.id} size="sm">
                  <CardContent className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {attendee.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {unitLabel} -{" "}
                        {ROLE_LABELS[attendee.role] ?? attendee.role}
                      </p>
                    </div>
                    {attendee.coefficient != null && (
                      <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        {attendee.coefficient}%
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </TabsContent>

      {/* Tab: Agenda */}
      <TabsContent value="agenda">
        <div className="flex flex-col gap-3 pt-3">
          {agendaItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay puntos de agenda
            </p>
          ) : (
            agendaItems.map((item) => (
              <Card key={item.id} size="sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                      {item.position}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.discussion_summary && (
                    <div className="rounded-lg bg-gray-50 p-2">
                      <p className="text-[10px] font-medium text-gray-500">
                        Resumen
                      </p>
                      <p className="text-xs text-gray-700">
                        {item.discussion_summary}
                      </p>
                    </div>
                  )}

                  {item.decision && (
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <p className="text-[10px] font-medium text-emerald-600">
                        Decision
                      </p>
                      <p className="text-xs text-emerald-800">
                        {item.decision}
                      </p>
                    </div>
                  )}

                  {(item.vote_for > 0 ||
                    item.vote_against > 0 ||
                    item.vote_abstain > 0) && (
                    <div className="flex gap-3 text-[10px]">
                      <span className="text-emerald-700">
                        A favor: {item.vote_for}
                      </span>
                      <span className="text-red-700">
                        En contra: {item.vote_against}
                      </span>
                      <span className="text-gray-500">
                        Abstencion: {item.vote_abstain}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      {/* Tab: Compromisos */}
      <TabsContent value="compromisos">
        <div className="pt-3">
          <CommitmentsBoard
            commitments={commitments}
            assemblyId={assembly.id}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
