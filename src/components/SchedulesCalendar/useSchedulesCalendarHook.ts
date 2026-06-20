"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarActivity,
  fetchActivitiesForCalendar,
} from "@/src/lib/service/activity.service";

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
};

export default function useSchedulesCalendarHook() {
  const { data, isLoading, isError } = useQuery<CalendarActivity[]>({
    queryKey: ["activities-calendar"],
    queryFn: fetchActivitiesForCalendar,
    staleTime: 1000 * 60 * 5,
  });

  const events = useMemo<CalendarEvent[]>(
    () =>
      (data ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        start: new Date(a.start),
        end: new Date(a.end),
        color: TYPE_COLOR[a.type] ?? "#888",
      })),
    [data]
  );

  return { events, isLoading, isError };
}
