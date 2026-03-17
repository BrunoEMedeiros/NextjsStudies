"use client";

import { Calendar } from "@/src/components/ui/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

export default function DateTimeActivityCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={ptBR} // 2. Pass it to the Calendar
      className="rounded-lg border"
    />
  );
}
