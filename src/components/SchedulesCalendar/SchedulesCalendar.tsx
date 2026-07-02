"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/src/styles/calendar.css";
import { Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import useScheduleCalendar, { CalendarEvent } from "./useSchedulesCalendar";

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

const TYPE_LABEL: Record<string, string> = {
  event: "Evento",
  course: "Curso",
  ceremony: "Cerimônia",
};

function EventDetailDialog({
  event,
  onClose,
}: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-night rounded-xl shadow-xl p-6 w-80 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-earth-yellow font-bold text-lg leading-tight">
            {event.title}
          </h2>
          <Badge variant="outline" className="shrink-0 text-xs">
            {TYPE_LABEL[event.type] ?? event.type}
          </Badge>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <p>
            <span className="text-gray-400">Início: </span>
            {format(event.start, "dd/MM/yyyy HH:mm")}
          </p>
          <p>
            <span className="text-gray-400">Fim: </span>
            {format(event.end, "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-earth-yellow text-night font-semibold rounded-lg py-2 text-sm hover:opacity-90 transition-opacity"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function CalendarLegend() {
  return (
    <div className="flex gap-4 mb-4">
      {[
        { label: "Evento", color: "#DBAD6C" },
        { label: "Curso", color: "#6C9EDB" },
        { label: "Cerimônia", color: "#6CDB8A" },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 text-sm text-gray-300"
        >
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96 text-gray-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando atividades...
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-96 text-destructive gap-2">
        <AlertCircle className="w-5 h-5" /> Erro ao carregar atividades.
      </div>
    );

  return (
    <div>
      <CalendarLegend />
      <div style={{ height: 680 }}>
        <Calendar
          localizer={localizer}
          events={events}
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
            return {
              style: {
                backgroundColor: ev.color,
                border: "none",
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
      {selected && (
        <EventDetailDialog event={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
