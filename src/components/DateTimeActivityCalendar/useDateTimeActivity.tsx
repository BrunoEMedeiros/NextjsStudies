import { addScheduleItem } from "@/src/lib/feature/auth/scheduleSlice";
import { RootState } from "@/src/lib/store";
import { randomUUID } from "crypto";
import { useDispatch, useSelector } from "react-redux";

interface DateTimeActivityProps {
  date: string;
  time: string;
}

export function useDateTimeActivity() {
  const dispatch = useDispatch();
  const scheduleItems = useSelector((state: RootState) => state.schedule.items);

  const handleAddNewItem = ({ date, time }: DateTimeActivityProps) => {
    dispatch(
      addScheduleItem({
        id: crypto.randomUUID(),
        date: date,
        time: time,
      })
    );
  };

  return { scheduleItems, handleAddNewItem };
}
