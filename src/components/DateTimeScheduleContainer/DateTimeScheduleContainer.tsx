"use client";
import { useSelector } from "react-redux";
import { DateTimeChip } from "../DateTimeChip/DateTimeChip";
import { RootState } from "@/src/lib/store";

export default function DateTimeSchedule() {
  const scheduleItems = useSelector((state: RootState) => state.schedule.items);

  return (
    <div className="col-span-2">
      <p className="text-lg font-light">Datas e Horários</p>
      <div
        className={`col-span-2 border rounded-md border-gray-700 px-4 py-5 flex  content-start flex-wrap gap-4 ${
          scheduleItems.length == 0 && "justify-center items-center"
        } `}
      >
        {scheduleItems.length > 0 ? (
          scheduleItems.map((item) => {
            let splitTime = item.time.split(":");
            const brazilianDate = new Intl.DateTimeFormat("pt-BR", {
              timeZone: "UTC",
            }).format(new Date(item.date));
            return (
              <DateTimeChip
                key={`${item.date}-${item.time}`}
                date={`${brazilianDate}`}
                time={`${splitTime[0]}:${splitTime[1]}`}
                id={item.id}
              />
            );
          })
        ) : (
          <p className="font-light text-sm ">
            Nenhuma data e horario agendados
          </p>
        )}
      </div>
    </div>
  );
}
