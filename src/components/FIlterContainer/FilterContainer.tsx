"use client";
import { FaSave, FaSearch } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";
import { Button } from "../ui/button";
import { useFiltersHook } from "./useFilterHook";
import { FilterChip } from "../FilterChip/FilterChip";
import { RotatingLines } from "react-loader-spinner";
import { FilterContainerSkeleton } from "./FilterContainerSkeleton"; // ← import

export default function FilterContainer() {
  const {
    filters,
    onSubmit,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    onDelete,
    isLoading,
    onUpdate,
    isUpdating,
  } = useFiltersHook();

  if (isLoading) return <FilterContainerSkeleton />;

  return (
    <div className="col-span-2">
      <p className="text-lg font-light">Filtros</p>
      <div
        className={`col-span-2 border rounded-md border-gray-700 p-4 flex flex-col gap-4 `}
      >
        <div className="flex gap-2">
          <FormTextField
            className="w-1/4"
            placeholder="Crie um novo filtro"
            {...register("descricao")}
            error={errors.descricao}
          />
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className={`${
              isSubmitting ? "bg-gray-600" : "bg-green-600"
            } w-16 h-full border-0 group hover:bg-white hover:cursor-pointer p-4`}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center">
                <RotatingLines
                  visible={true}
                  height="30"
                  width="30"
                  color="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              <FaSave
                size={12}
                className="text-white group-hover:text-rich-black"
              />
            )}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.length > 0 ? (
            filters.map((item) => {
              return (
                <FilterChip
                  key={item.id}
                  id={item.id}
                  descricao={item.descricao}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  isAnyMutating={isUpdating}
                />
              );
            })
          ) : (
            <p className="font-light text-sm ">Nenhum filtro cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
