"use client";
import ActivitiesList from "../ActivitiesList/ActivitiesList";
import ActivityTypeSelectOption from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
import FormTextField from "../FormTextField/FormTextField";
import { Button } from "../ui/button";
import useActivityContainer from "./useActivityContainer";
import { FaSearch } from "react-icons/fa";

export default function ActivityContainer() {
  const {
    filterOptions,
    activityTypeOptions,
    activities,
    register,
    handleSubmit,
    onSearch,
    currentPage,
    setCurrentPage,
  } = useActivityContainer();

  const pagination = activities.data;

  return (
    <div className="flex flex-col gap-4 w-4/5">
      <form onSubmit={handleSubmit(onSearch)} className="flex gap-4 items-end">
        <div className="w-1/4 flex flex-col gap-1 shrink-0">
          <label
            className="text-earth-yellow font-thin"
            htmlFor="searchByTitle"
          >
            Procurar atividade
          </label>
          <FormTextField
            id="searchByTitle"
            placeholder="Procure pelo titulo..."
            className="w-full"
            containerClassName="w-full"
            {...register("title")}
          />
        </div>

        <ActivityTypeSelectOption
          options={[
            { label: "Sem filtro", value: "", key: "" },
            ...filterOptions,
          ]}
          label="Filtros"
          {...register("filterId")}
        />

        <ActivityTypeSelectOption
          options={activityTypeOptions}
          label="Tipo"
          {...register("type")}
        />

        <div className="flex flex-col gap-1">
          <label className="text-earth-yellow font-thin" htmlFor="startDate">
            Data de inicio
          </label>
          <input
            className="bg-rich-black py-2.5 px-3 border border-gray-700 rounded-md text-white"
            id="startDate"
            type="date"
            {...register("dateFrom")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-earth-yellow font-thin" htmlFor="endDate">
            Data de fim
          </label>
          <input
            className="bg-rich-black py-2.5 px-3 border border-gray-700 rounded-md text-white"
            id="endDate"
            type="date"
            {...register("dateTo")}
          />
        </div>

        <Button
          variant="outline"
          type="submit"
          className="bg-green-600 w-16 h-14 border-0 group hover:bg-white hover:cursor-pointer p-4"
        >
          <FaSearch size={12} />
        </Button>
      </form>

      <ActivitiesList
        activities={activities.data?.data ?? []}
        isLoading={activities.isLoading}
      />

      {pagination && (
        <div className="flex items-center gap-4 self-center">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border-gray-700 bg-rich-black text-white hover:bg-gray-800 disabled:opacity-40"
          >
            Anterior
          </Button>

          <span className="text-white text-sm">
            {currentPage} / {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={!pagination.hasMore}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border-gray-700 bg-rich-black text-white hover:bg-gray-800 disabled:opacity-40"
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
