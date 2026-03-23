"use client";
import { useSelector } from "react-redux";
import { DateTimeChip } from "../DateTimeChip/DateTimeChip";
import { RootState } from "@/src/lib/store";

export default function DateTimeSchedule() {
  const scheduleItems = useSelector((state: RootState) => state.schedule.items);

  console.log(scheduleItems);

  return (
    <>
      <div>
        <p className="text-lg font-light">Datas e Horários</p>
      </div>
      <div className="w-full col-span-2 border rounded border-white p-4 flex flex-col">
        <div className="flex flex-wrap gap-2">
          {scheduleItems.map((item) => {
            let splitTime = item.time.split(":");
            const [year, month, day] = item.date.split("-").map(Number);
            const date = new Date(Date.UTC(year, month - 1, day));
            const brazilianDate = date.toLocaleDateString("pt-BR");
            return (
              <DateTimeChip
                key={`${item.date}-${item.time}`}
                label={`${brazilianDate} | ${splitTime[0]}:${splitTime[1]}`}
                id={item.id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
