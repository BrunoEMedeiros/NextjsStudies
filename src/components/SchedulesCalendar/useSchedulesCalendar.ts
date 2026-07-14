import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Views } from "react-big-calendar";
import {
  CalendarActivity,
  fetchActivitiesForCalendar,
  fetchActivitiesForCalendarRange,
} from "@/src/lib/service/activity.service";
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";

const TYPE_COLOR: Record<string, string> = {
  event: "#DBAD6C",
  course: "#6C9EDB",
  ceremony: "#6CDB8A",
};

export type CalendarEvent = {
  id: number;
  title: string;
  type: string;
  start: Date;
  end: Date;
  color: string;
  occurrenceDate: string;
  occurrenceTime: string;
};

export type CalendarRange = { start: Date; end: Date } | null;

const pad = (n: number) => String(n).padStart(2, "0");

function toEvents(data: CalendarActivity[]): CalendarEvent[] {
  return data.map((a) => {
    const start = new Date(a.start);
    const occurrenceDate = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
    ).toISOString();
    const occurrenceTime = `${pad(start.getUTCHours())}:${pad(
      start.getUTCMinutes()
    )}:${pad(start.getUTCSeconds())}`;

    return {
      id: a.id,
      title: a.title,
      type: a.type,
      start,
      end: new Date(a.end),
      color: TYPE_COLOR[a.type] ?? "#888",
      occurrenceDate,
      occurrenceTime,
    };
  });
}

export default function useScheduleCalendar() {
  const [view, setView] = useState<string>(Views.MONTH);
  const [range, setRange] = useState<CalendarRange>(null);

  const isRangeView = view === Views.WEEK || view === Views.DAY;

  const {
    data: monthData,
    isLoading: monthLoading,
    isError: monthError,
  } = useQuery<CalendarActivity[]>({
    queryKey: ["activities-calendar-month"],
    queryFn: fetchActivitiesForCalendar,
    enabled: !range,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: rangeData,
    isLoading: rangeLoading,
    isError: rangeError,
  } = useQuery<CalendarActivity[]>({
    queryKey: [
      "activities-calendar-range",
      range?.start?.toISOString(),
      range?.end?.toISOString(),
    ],
    queryFn: () => fetchActivitiesForCalendarRange(range!.start, range!.end),
    enabled: !!range,
    staleTime: 1000 * 60 * 2,
  });

  const events = useMemo<CalendarEvent[]>(() => {
    if (range) return toEvents(rangeData ?? []);
    return toEvents(monthData ?? []);
  }, [range, monthData, rangeData]);

  const toUTCRange = (d: Date) => {
    const start = new Date(d);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setUTCHours(23, 59, 59, 999);
    return { start, end };
  };

  const onRangeChange = (r: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(r)) {
      const start = new Date(r[0]);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(r[r.length - 1]);
      end.setUTCHours(23, 59, 59, 999);
      setRange({ start, end });
    } else {
      const start = new Date(r.start);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(r.end);
      end.setUTCHours(23, 59, 59, 999);
      setRange({ start, end });
    }
  };

  const onView = (newView: string) => {
    setView(newView);
    if (newView === Views.WEEK) {
      const s = startOfWeek(new Date());
      const e = endOfWeek(new Date());
      s.setUTCHours(0, 0, 0, 0);
      e.setUTCHours(23, 59, 59, 999);
      setRange({ start: s, end: e });
    } else if (newView === Views.DAY) {
      setRange(toUTCRange(new Date()));
    } else {
      setRange(null);
    }
  };

  const [date, setDate] = useState(new Date());

  const onNavigate = (newDate: Date) => setDate(newDate);

  const onDrillDown = (newDate: Date) => {
    setDate(newDate);
    setView(Views.DAY);
    setRange(toUTCRange(newDate));
  };

  return {
    events,
    view,
    date,
    onView,
    onNavigate,
    onDrillDown,
    onRangeChange,
    isLoading: range ? rangeLoading : monthLoading,
    isError: range ? rangeError : monthError,
  };
}
