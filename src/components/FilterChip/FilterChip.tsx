import { Badge } from "@/src/components/ui/badge";
import { FilterType } from "@/src/lib/service/filter.service";
import { FaEdit, FaSave } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  newFilterSchema,
  NewFilterType,
} from "@/src/lib/schemas/newFilter.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type FilterChipProps = FilterType & {
  onDelete: (id: number) => Promise<void>;
  onUpdate: (filter: FilterType) => Promise<void>;
};

export function FilterChip({
  id,
  descricao,
  onDelete,
  onUpdate,
}: FilterChipProps) {
  const [editMode, setEditMode] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewFilterType>({
    resolver: zodResolver(
      newFilterSchema
    ) as unknown as Resolver<NewFilterType>,
    defaultValues: { descricao },
  });

  const handleSave = handleSubmit(async (data) => {
    await onUpdate({ id, descricao: data.descricao });
    setEditMode(true);
  });

  return (
    <Badge
      variant="outline"
      className="pl-6 py-6 pr-3 bg-rich-black text-white text-base font-light"
      key={id}
    >
      <FormTextField
        placeholder={descricao}
        disabled={editMode}
        containerClassName="border-none"
        autoResize
        {...register("descricao")}
        error={errors.descricao}
      />

      <div className="ml-4 flex">
        {editMode ? (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <FaEdit size={16} color="#dbad6c" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <FaSave size={16} color="#00875f" />
          </button>
        )}
        <DeleteDialog
          id={id}
          label={`Excluir o filtro: `}
          itemName={descricao}
          text="Este filtro será permanentemente apagado"
          deleteFunction={onDelete}
        />
      </div>
    </Badge>
  );
}
