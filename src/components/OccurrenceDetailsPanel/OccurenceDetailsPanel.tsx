"use client";

import {
  Users,
  UtensilsCrossed,
  Wifi,
  MapPin,
  Receipt,
  CalendarDays,
  Clock,
  Loader2,
  AlertCircle,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import useOccurrenceAttendees from "./useOccurenceAtendees";
import { CalendarEvent } from "../SchedulesCalendar/useSchedulesCalendar";
import { ACTIVITY_TYPE_LABELS } from "@/src/lib/activityType";

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-grey-400/30 px-3 py-2">
      <Icon className="w-4 h-4 text-earth-yellow shrink-0" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white">{value}</span>
        <span className="text-[11px] text-grey-300">{label}</span>
      </div>
    </div>
  );
}

export default function OccurrenceDetailsPanel({
  event,
}: {
  event: CalendarEvent | null;
}) {
  const { data, isLoading, isError } = useOccurrenceAttendees(event);

  if (!event) {
    return (
      <Card className="bg-rich-black ring-grey-400/40 h-full">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-grey-300 gap-2 text-center px-6">
          <MousePointerClick className="w-6 h-6 text-earth-yellow" />
          <p className="text-sm">
            Selecione uma atividade no calendário para ver os detalhes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-rich-black ring-grey-400/40 h-full">
      <CardContent className="flex flex-col gap-4 h-full min-h-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              {event.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-grey-300 mt-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {format(event.start, "dd/MM/yyyy", { locale: ptBR })}
              <Clock className="w-3.5 h-3.5 ml-1.5" />
              {format(event.start, "HH:mm")}
            </div>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 text-xs"
            style={{ borderColor: event.color, color: event.color }}
          >
            {ACTIVITY_TYPE_LABELS[event.type] ?? event.type}
          </Badge>
        </div>

        <Separator />

        {isLoading ? (
          <div className="flex items-center justify-center flex-1 text-grey-300 gap-2 min-h-[240px]">
            <Loader2 className="w-5 h-5 animate-spin text-earth-yellow" />
            Carregando participantes...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center flex-1 text-destructive gap-2 min-h-[240px]">
            <AlertCircle className="w-5 h-5" />
            Erro ao carregar participantes.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <StatBlock
                icon={Users}
                label="Pessoas inscritas"
                value={data?.totalPeople ?? 0}
              />
              <StatBlock
                icon={Receipt}
                label="Agendamentos"
                value={data?.totalSchedules ?? 0}
              />
              <StatBlock
                icon={UtensilsCrossed}
                label="Restrição alimentar"
                value={data?.foodRestrictionsCount ?? 0}
              />
              <StatBlock
                icon={Receipt}
                label={
                  data?.paymentRequired ? "Pagamento exigido" : "Sem pagamento"
                }
                value={data?.paymentRequired ? "Sim" : "Não"}
              />
            </div>

            <Separator />

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {data?.attendees.length === 0 ? (
                <p className="text-sm text-grey-300 text-center py-8">
                  Nenhum inscrito neste horário.
                </p>
              ) : (
                data?.attendees.map((a) => (
                  <div
                    key={a.scheduleId}
                    className="rounded-lg bg-grey-400/20 px-3 py-2.5 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {a.name}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-grey-300 shrink-0">
                        {a.modality === "online" ? (
                          <Wifi className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {a.modality === "online" ? "Online" : "Presencial"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-grey-300">
                      <span>{a.phone}</span>
                      {a.personNumber > 1 && (
                        <span className="text-earth-yellow">
                          +{a.personNumber - 1} acompanhante
                          {a.personNumber - 1 > 1 ? "s" : ""}
                        </span>
                      )}
                      {a.foodRestriction && (
                        <span className="flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3" />
                          {a.foodRestriction}
                        </span>
                      )}
                    </div>
                    {data?.paymentRequired && a.paymentReceiptUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="xs"
                        className="self-start mt-1"
                      >
                        <a
                          href={a.paymentReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink />
                          Ver comprovante
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
