import { Badge } from "@/src/components/ui/badge";
import { FilterType } from "@/src/lib/service/filter.service";
import { FaTrash, FaEdit } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";

export function FilterChip({ id, descricao }: FilterType) {
  return (
    <Badge
      variant="outline"
      className="pl-6 py-6 pr-3 bg-rich-black text-white text-base font-light"
    >
      <FormTextField
        placeholder={descricao}
        disabled
        containerClassName="border-none"
        autoResize // <--- Simply pass this prop!
      />

      <div className="ml-4 flex gap-2">
        <button
          type="button"
          onClick={() => {}}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <FaTrash size={14} color="#e25858" />
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <FaEdit size={14} color="#dbad6c" />
        </button>
      </div>
    </Badge>
  );
}
