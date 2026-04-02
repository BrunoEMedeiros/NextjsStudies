"use client";
import { FaSave, FaSearch } from "react-icons/fa";
import FormTextField from "../FormTextField/FormTextField";
import { Button } from "../ui/button";
import { useFiltersHook } from "./useFilterHook";
import { FilterChip } from "../FilterChip/FilterChip";

export default function FilterContainer() {
  const { filters } = useFiltersHook();
  return (
    <div className="col-span-2">
      <p className="text-lg font-light">Filtros</p>
      <div
        className={`col-span-2 border rounded-md border-gray-700 p-4 flex flex-col gap-4 `}
      >
        <div className="flex gap-2 items-center">
          <FormTextField className="w-1/4" placeholder="Crie um novo filtro" />
          <Button
            variant="outline"
            className="w-16 h-12 bg-green-600 border-0 group hover:bg-white hover:cursor-pointer p-4"
            onClick={() => {}}
          >
            <FaSave
              size={12}
              className="text-white group-hover:text-rich-black"
            />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.length > 0 ? (
            filters.map((item) => {
              return <FilterChip id={item.id} descricao={item.descricao} />;
            })
          ) : (
            <p className="font-light text-sm ">Nenhum filtro cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
