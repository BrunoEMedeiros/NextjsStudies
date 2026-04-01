import { Badge } from "@/src/components/ui/badge";
import { removeScheduleItem } from "@/src/lib/feature/auth/scheduleSlice";
import { FilterType } from "@/src/lib/service/filter.service";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";

export function FilterChip({ id, descricao }: FilterType) {
  return (
    <Badge variant="outline" className="p-4 bg-rich-black text-white">
      {descricao}
      <button
        type="button" // Always specify type="button" so it doesn't accidentally submit forms
        onClick={() => {}}
        className="ml-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <FaTrash color="#e25858" />
      </button>
    </Badge>
  );
}
