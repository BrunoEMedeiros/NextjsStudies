"use client";

import { ptBR } from "date-fns/locale";
import { Calendar } from "@/src/components/ui/calendar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaClock } from "react-icons/fa";
import { Field, FieldLabel } from "../ui/field";
import { FaSave, FaTrash } from "react-icons/fa";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { useDateTimeActivity } from "./useDateTimeActivity";
import { DateTimeActivityCalendarSkeleton } from "./DateTimeActivityCalendarSkeleton";

export default function DateTimeActivityCalendar() {
  const {
    scheduleItems,
    handleAddNewItem,
    handleAddDates,
    dateRange,
    setDateRange,
    time,
    setTime,
    eventDays,
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
    handleCleanAllScheduleDates,
  } = useDateTimeActivity();

  if (isLoading) return <DateTimeActivityCalendarSkeleton />;

  return (
    <div className="flex flex-col gap-3 col-span-1 w-full">
      <Card
        size="default"
        className="mx-auto w-fit overflow-visible rounded-lg"
      >
        <CardContent className="p-0">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ptBR}
            classNames={{
              day: "w-12 h-12 text-lg mx-0.5 rounded-lg",
              caption_label: "text-2xl",
              selected:
                "[&>button]:bg-white [&>button]:text-[#0e141b] [&>button]:rounded-lg",
              today:
                "[&>button]:border [&>button]:border-white [&>button]:text-light-coral",
              range_start: "rounded-lg",
              range_middle: "bg-white",
              range_end: "rounded-lg",
            }}
            modifiers={{ event: eventDays }}
            modifiersClassNames={{
              event: "bg-white text-black rounded-lg",
            }}
          />
        </CardContent>
        <CardFooter className="border-t bg-card rounded-b-lg">
          <Field>
            <FieldLabel htmlFor="time-from">Horario</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                value={time} // Controlled value
                onChange={(e) => setTime(e.target.value)} // Update state on change
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <FaClock className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </CardFooter>
      </Card>

      <div className="flex justify-center gap-2 mt-2">
        <Button
          type="button"
          variant="outline"
          className="w-16 h-10 bg-green-600 border-0 group hover:bg-white hover:cursor-pointer p-4"
          onClick={handleAddDates}
        >
          <FaSave
            size={12}
            className="text-white group-hover:text-rich-black"
          />
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-16 h-10 bg-danger border-0 group hover:bg-white hover:cursor-pointer p-4"
          onClick={handleCleanAllScheduleDates}
        >
          <FaTrash
            size={12}
            className="text-white group-hover:text-rich-black"
          />
        </Button>
      </div>
    </div>
  );
}
