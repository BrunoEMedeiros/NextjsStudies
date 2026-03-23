import { Badge } from "@/src/components/ui/badge";
import { removeScheduleItem } from "@/src/lib/feature/auth/scheduleSlice";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";

interface DateTimeChipProps {
  label: string;
  id: string;
}

export function DateTimeChip({ label, id }: DateTimeChipProps) {
  const dispatch = useDispatch();

  return (
    <Badge variant="outline" className="p-4 bg-rich_black text-white">
      {label}
      <button
        type="button" // Always specify type="button" so it doesn't accidentally submit forms
        onClick={() => dispatch(removeScheduleItem(id))}
        className="mx-3 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <FaTrash color="#e25858" />
      </button>
    </Badge>
  );
}
