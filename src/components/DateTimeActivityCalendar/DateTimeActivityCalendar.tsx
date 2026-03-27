"use client";

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { eachDayOfInterval } from "date-fns"; // added eachDayOfInterval and format
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/src/components/ui/calendar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaPlus, FaClock } from "react-icons/fa";
import { Field, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { useDateTimeActivity } from "./useDateTimeActivity";

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
  } = useDateTimeActivity();

  return (
    <div className="flex flex-col gap-3 col-span-1 w-full">
      <Card size="sm" className="mx-auto w-fit overflow-visible rounded-lg">
        <CardContent className="p-0">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ptBR}
            // className="p-0 rounded-b-lg
            //   [&_table]:w-full
            //   [&_td]:px-2 [&_td]:py-1
            //   [&_td]:text-center
            //   [&_.rdp-day]:w-12 [&_.rdp-day]:h-12
            //   [&_.rdp-day]:mx-auto
            //   [&_.rdp-day]:text-base
            //   [&_.rdp-day:hover]:bg-transparent
            //   [&_.rdp-day:hover]:text-inherit
            //   [&_.rdp-day:hover]:cursor-default
            //   [&_.rdp-caption_label]:text-xl
            //   [&_.rdp-day.day-range-middle]:bg-accent
            //   [&_.rdp-day.day-range-middle]:text-accent-foreground"
            modifiers={{ event: eventDays }}
            modifiersClassNames={{
              event: "bg-earth-yellow text-black ",
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
          variant="outline"
          className="w-30 bg-green-600 border-0 group hover:bg-white hover:cursor-pointer"
          onClick={handleAddDates}
        >
          <FaPlus
            size={14}
            className="text-white group-hover:text-rich_black"
          />
        </Button>
      </div>
    </div>
  );
}
