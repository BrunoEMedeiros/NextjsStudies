import { Badge } from "@/src/components/ui/badge";
import { FilterType } from "@/src/lib/service/filter.service";
import { FaEdit, FaSave } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  newFilterSchema,
  NewFilterType,
} from "@/src/lib/schemas/newFilter.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import {
  addFilterItem,
  removeFilterItem,
} from "@/src/lib/feature/filter/filterSlice";

type FilterChipProps = FilterType & {
  onDelete: (id: number) => Promise<void>;
  onUpdate: (filter: FilterType) => Promise<void>;
  isAnyMutating: boolean;
};

export function FilterChip({
  id,
  descricao,
  onDelete,
  onUpdate,
  isAnyMutating,
}: FilterChipProps) {
  const [editMode, setEditMode] = useState<boolean>(true);

  const dispatch = useDispatch();
  const filterItems = useSelector((state: RootState) => state.filter.filters);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewFilterType>({
    resolver: zodResolver(
      newFilterSchema
    ) as unknown as Resolver<NewFilterType>,
    defaultValues: { descricao },
  });

  useEffect(() => {
    reset({ descricao });
  }, [descricao]);

  const enterEditMode = () => {
    if (isAnyMutating) return;
    setEditMode(false);
    setTimeout(() => setFocus("descricao"), 0);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return; // focus stayed inside
    setEditMode(true);
    reset({ descricao });
  };

  const handleSave = handleSubmit(async (data) => {
    await onUpdate({ id, descricao: data.descricao });
    setEditMode(true);
  });

  const handleSelectFilter = () => {
    const test = filterItems.find((item) => item.id == id);
    if (test) {
      dispatch(removeFilterItem(id));
      return;
    }
    dispatch(addFilterItem({ id, descricao: descricao }));
  };

  const isFrozen = isSubmitting || isAnyMutating;

  return (
    <div className={`flex flex-col`}>
      {errors.descricao && (
        <p className="text-red-500 text-sm px-1">{errors.descricao.message}</p>
      )}
      <div onBlur={handleBlur} tabIndex={-1} className="outline-none">
        <Badge
          onClick={handleSelectFilter}
          variant="outline"
          className={`
          pl-6 py-6 pr-3 bg-rich-black text-white text-base font-light
          transition-all duration-300 border-2
          ${
            isSubmitting
              ? "ring-2 ring-light-coral animate-pulse opacity-80"
              : ""
          }
          ${
            isAnyMutating && !isSubmitting
              ? "opacity-40 pointer-events-none"
              : ""
          }
             ${
               filterItems.find((item) => item.id == id)
                 ? `border-earth-yellow`
                 : `border-transparent`
             }`}
        >
          <FormTextField
            placeholder={descricao}
            disabled={editMode || isFrozen}
            containerClassName="border-none"
            autoResize
            className={editMode ? "pointer-events-none select-none" : ""}
            {...register("descricao")}
          />
          <div className="ml-4 flex items-center gap-1">
            {isSubmitting ? (
              // Saving spinner replaces both buttons while mutating
              <RotatingLines
                visible
                width="16"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="saving"
              />
            ) : editMode ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  enterEditMode();
                }}
                disabled={isFrozen}
                className="cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-not-allowed"
              >
                <FaEdit size={16} color="#dbad6c" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isFrozen}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <FaSave size={16} color="#00875f" />
              </button>
            )}

            <DeleteDialog
              buttonStyle="bg-rich-black hover:bg-rich-black"
              id={id}
              label="Excluir o filtro: "
              itemName={descricao}
              text="Este filtro será permanentemente apagado"
              deleteFunction={onDelete}
            />
          </div>
        </Badge>
      </div>
    </div>
  );
}
