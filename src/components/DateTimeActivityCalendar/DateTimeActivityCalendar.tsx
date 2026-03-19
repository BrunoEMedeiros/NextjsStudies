"use client";

import { Calendar } from "@/src/components/ui/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";
import FormTextField from "../FormTextField/FormTextField";
import { Button } from "../ui/button";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaPlus, FaTrash, FaClock } from "react-icons/fa";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export default function DateTimeActivityCalendar() {
  // const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });

  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12)
  );

  return (
    <div className="flex flex-col gap-3 col-span-1 w-full">
      <label className={`text-base text-earth-yellow font-light`}>
        Agendar data e horario
      </label>
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            locale={ptBR}
            numberOfMonths={2}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <Field>
            <FieldLabel htmlFor="time-from">Horario</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <FaClock className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </CardFooter>
      </Card>
      {/* <div className="flex gap-4 w-full">
        <FormTextField
          label="Horario"
          className="w-20 flex flex-col"
          labelClassName="text-base text-earth-yellow font-bold"
          type="text"
          placeholder="00:00"
          mask="99:99"
          maskOptions={{
            inputFormat: "HH:MM",
            placeholder: "00:00",
            clearIncomplete: true,
          }}
        /> */}
      <div className="flex justify-center gap-2 mt-2">
        <Button
          variant="outline"
          className="w-30 bg-green-600 border-0 group hover:bg-white hover:cursor-pointer"
        >
          <FaPlus
            size={14}
            className="text-white group-hover:text-rich_black"
          />
        </Button>
        <Button
          variant="outline"
          className="w-30 bg-danger border-0 group hover:bg-white hover:cursor-pointer"
        >
          <FaTrash
            size={14}
            className="text-white group-hover:text-rich_black"
          />
        </Button>
      </div>
    </div>
    // </div>
  );
}
