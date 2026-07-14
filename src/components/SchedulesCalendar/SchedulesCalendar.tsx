"use client";

import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/src/styles/calendar.css";
import { Loader2, AlertCircle, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import useScheduleCalendar, { CalendarEvent } from "./useSchedulesCalendar";
import OccurrenceDetailsPanel from "../OccurrenceDetailsPanel/OccurenceDetailsPanel";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales: { "pt-BR": ptBR },
});

const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Nenhuma atividade neste período.",
};

const TYPE_META: { key: string; label: string; color: string }[] = [
  { key: "event", label: "Evento", color: "#DBAD6C" },
  { key: "course", label: "Curso", color: "#6C9EDB" },
  { key: "ceremony", label: "Cerimônia", color: "#6CDB8A" },
];

function CalendarLegend({
  activeTypes,
  onToggle,
  counts,
}: {
  activeTypes: Set<string>;
  onToggle: (key: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TYPE_META.map((item) => {
        const active = activeTypes.has(item.key);
        return (
          <button
            key={item.key}
            onClick={() => onToggle(item.key)}
            className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
              active
                ? "border-transparent bg-grey-400/60 text-white"
                : "border-grey-400 text-grey-300 opacity-50"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
            <span className="text-[10px] text-grey-300">
              {counts[item.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ScheduleCalendar() {
  const {
    events,
    view,
    date,
    onView,
    onNavigate,
    onDrillDown,
    onRangeChange,
    isLoading,
    isError,
  } = useScheduleCalendar();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(
    new Set(TYPE_META.map((t) => t.key))
  );

  const counts = useMemo(() => {
    return events.reduce<Record<string, number>>((acc, e) => {
      acc[e.type] = (acc[e.type] ?? 0) + 1;
      return acc;
    }, {});
  }, [events]);

  const filteredEvents = useMemo(
    () => events.filter((e) => activeTypes.has(e.type)),
    [events, activeTypes]
  );

  const toggleType = (key: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="w-full max-w-7xl space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-earth-yellow" />
          Agenda de Atividades
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        <Card className="bg-rich-black ring-grey-400/40 max-h-[calc(100vh-8rem)]">
          <CardContent className="flex flex-col gap-4 pt-2 min-h-0 overflow-y-auto">
            <CalendarLegend
              activeTypes={activeTypes}
              onToggle={toggleType}
              counts={counts}
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 text-grey-300 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-earth-yellow" />
                Carregando atividades...
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-96 text-destructive gap-2">
                <AlertCircle className="w-6 h-6" />
                Erro ao carregar atividades.
              </div>
            ) : (
              <div
                className="calendar-wrapper shrink-0"
                style={{ height: 680 }}
              >
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  messages={messages}
                  culture="pt-BR"
                  view={view as any}
                  date={date}
                  onView={onView}
                  onNavigate={onNavigate}
                  selectable
                  onSelectSlot={({ start }) => onDrillDown(start)}
                  onRangeChange={onRangeChange}
                  onSelectEvent={(e) => setSelected(e as CalendarEvent)}
                  eventPropGetter={(e) => {
                    const ev = e as CalendarEvent;
                    const isSelected = selected?.id === ev.id;
                    return {
                      style: {
                        backgroundColor: ev.color,
                        border: isSelected ? "2px solid white" : "none",
                        borderRadius: 6,
                        color: "#1a1a1a",
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    };
                  }}
                  popup
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-4 h-186 max-h-[calc(100vh-8rem)] overflow-hidden">
          <OccurrenceDetailsPanel event={selected} />
        </div>
      </div>
    </div>
  );
}
