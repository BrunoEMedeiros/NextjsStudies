"use client";

import ScheduleCalendar from "@/src/components/SchedulesCalendar/SchedulesCalendar";

export default function SchedulesPage() {
  return (
    <div className="flex flex-col pb-20">
      <div className="flex justify-center">
        <ScheduleCalendar />
      </div>
    </div>
  );
}
