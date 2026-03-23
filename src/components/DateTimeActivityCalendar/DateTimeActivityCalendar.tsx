// "use client";

// import { Calendar } from "@/src/components/ui/calendar";
// import { useState } from "react";
// import { ptBR } from "date-fns/locale";
// import FormTextField from "../FormTextField/FormTextField";
// import { Button } from "../ui/button";
// import { addDays } from "date-fns";
// import { type DateRange } from "react-day-picker";
// import { Card, CardContent, CardFooter } from "../ui/card";
// import { FaPlus, FaTrash, FaClock } from "react-icons/fa";
// import { Field, FieldGroup, FieldLabel } from "../ui/field";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
// } from "../ui/input-group";
// import { useDateTimeActivity } from "./useDateTimeActivity";

// export default function DateTimeActivityCalendar() {
//   const [dateRange, setDateRange] = useState<DateRange | undefined>({
//     from: new Date(new Date().getFullYear(), 0, 12),
//     to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
//   });

//   const { handleAddNewItem, scheduleItems } = useDateTimeActivity();

//   return (
//     <div className="flex flex-col gap-3 col-span-1 w-full">
//       <label className={`text-base text-earth-yellow font-light`}>
//         Agendar data e horario
//       </label>
//       <Card size="sm" className="mx-auto w-fit">
//         <CardContent>
//           <Calendar
//             mode="range"
//             defaultMonth={dateRange?.from}
//             selected={dateRange}
//             onSelect={setDateRange}
//             locale={ptBR}
//             numberOfMonths={2}
//             // disabled={(date) =>
//             //   date > new Date() || date < new Date("1900-01-01")
//             // }
//           />
//         </CardContent>
//         <CardFooter className="border-t bg-card">
//           <Field>
//             <FieldLabel htmlFor="time-from">Horario</FieldLabel>
//             <InputGroup>
//               <InputGroupInput
//                 id="time-from"
//                 type="time"
//                 step="1"
//                 defaultValue="10:30:00"
//                 className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
//               />
//               <InputGroupAddon>
//                 <FaClock className="text-muted-foreground" />
//               </InputGroupAddon>
//             </InputGroup>
//           </Field>
//         </CardFooter>
//       </Card>
//       {/* <div className="flex gap-4 w-full">
//         <FormTextField
//           label="Horario"
//           className="w-20 flex flex-col"
//           labelClassName="text-base text-earth-yellow font-bold"
//           type="text"
//           placeholder="00:00"
//           mask="99:99"
//           maskOptions={{
//             inputFormat: "HH:MM",
//             placeholder: "00:00",
//             clearIncomplete: true,
//           }}
//         /> */}
//       <div className="flex justify-center gap-2 mt-2">
//         <Button
//           variant="outline"
//           className="w-30 bg-green-600 border-0 group hover:bg-white hover:cursor-pointer"
//           onClick={() => handleAddNewItem({ date: "", time: "" })}
//         >
//           <FaPlus
//             size={14}
//             className="text-white group-hover:text-rich_black"
//           />
//         </Button>
//         <Button
//           variant="outline"
//           className="w-30 bg-danger border-0 group hover:bg-white hover:cursor-pointer"
//         >
//           <FaTrash
//             size={14}
//             className="text-white group-hover:text-rich_black"
//           />
//         </Button>
//       </div>
//     </div>
//     // </div>
//   );
// }

"use client";

import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { addDays, eachDayOfInterval } from "date-fns"; // added eachDayOfInterval and format
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(), // Starts exactly on today's date
    to: new Date(),
  });

  const [time, setTime] = useState("10:30:00");

  const { handleAddNewItem } = useDateTimeActivity();

  const handleAddDates = () => {
    if (!dateRange || !dateRange.from) return;

    let datesToProcess: Date[] = [];

    if (dateRange.from && dateRange.to) {
      datesToProcess = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });
    } else {
      datesToProcess = [dateRange.from];
    }

    datesToProcess.forEach((dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(dateObj.getDate() + 1).padStart(2, "0");

      const safeFormattedDate = `${year}-${month}-${day}`;

      handleAddNewItem({
        date: safeFormattedDate,
        time: time,
      });
    });
  };

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
