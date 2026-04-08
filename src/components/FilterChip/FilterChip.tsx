import { Badge } from "@/src/components/ui/badge";
import { FilterType } from "@/src/lib/service/filter.service";
import { FaTrash, FaEdit } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";
import DeleteDialog from "../DeleteDialog/DeleteDialog";

export function FilterChip({ id, descricao }: FilterType) {
  return (
    <Badge
      variant="outline"
      className="pl-6 py-6 pr-3 bg-rich-black text-white text-base font-light"
      key={id}
    >
      <FormTextField
        placeholder={descricao}
        disabled
        containerClassName="border-none"
        autoResize
      />

      <div className="ml-4 flex">
        <button
          type="button"
          onClick={() => {}}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <FaEdit size={14} color="#dbad6c" />
        </button>
        <DeleteDialog
          id={id}
          label={`Excluir o filtro: `}
          itemName={descricao}
          text="Este filtro será permanentemente apagado"
          deleteFunction={() => {}}
        />
      </div>
    </Badge>
  );
}
