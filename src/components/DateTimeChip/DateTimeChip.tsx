import { Badge } from "@/src/components/ui/badge";
import { removeScheduleItem } from "@/src/lib/feature/auth/scheduleSlice";
import { FaTrash, FaCalendar, FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";

interface DateTimeChipProps {
  date: string;
  time: string;
  id: string;
}

export function DateTimeChip({ date, time, id }: DateTimeChipProps) {
  const dispatch = useDispatch();

  return (
    <div className="p-4 gap-2 flex flex-col bg-rich-black text-white text-sm rounded-lg border border-gray-700">
      <div className="flex flex-col items-center gap-2">
        <FaCalendar size={16} />
        <p>{date}</p>
      </div>
      <hr className=" h-px rounded mt-3 mb-2 bg-gray-300 border-0" />
      <div className="flex flex-col items-center gap-2">
        <FaClock size={16} />
        <p>{time}</p>
      </div>
      <button
        type="button"
        onClick={() => dispatch(removeScheduleItem(id))}
        className="flex justify-center items-center rounded-md ml-2 cursor-pointer hover:opacity-80 transition-opacity bg-danger p-2"
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
}
