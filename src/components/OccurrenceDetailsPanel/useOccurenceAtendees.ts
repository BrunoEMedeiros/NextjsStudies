"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchOccurrenceAttendees,
  OccurrenceAttendees,
} from "@/src/lib/service/schedule.service";
import { CalendarEvent } from "../SchedulesCalendar/useSchedulesCalendar";

export default function useOccurrenceAttendees(event: CalendarEvent | null) {
  const query = useQuery<OccurrenceAttendees>({
    queryKey: [
      "occurrence-attendees",
      event?.id,
      event?.occurrenceDate,
      event?.occurrenceTime,
    ],
    queryFn: () =>
      fetchOccurrenceAttendees(
        event!.id,
        event!.occurrenceDate,
        event!.occurrenceTime
      ),
    enabled: !!event,
    staleTime: 1000 * 60,
  });

  return query;
}
