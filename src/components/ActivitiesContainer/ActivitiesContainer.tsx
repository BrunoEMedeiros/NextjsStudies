"use client";
import { FilterType } from "@/src/lib/service/filter.service";
// import ActivitiesList from "../ActivitiesList/ActivitiesList";
import ActivityCard from "../ActivityCard/ActivityCard";
import ActivityCardSkeleton from "../ActivityCard/ActivityCardSkeleton";
import ActivityTypeSelectOption from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
import FormTextField from "../FormTextField/FormTextField";
import { Button } from "../ui/button";
import useActivityContainer from "./useActivityContainer";
import { FaSearch } from "react-icons/fa";
import { ActivityDetails } from "@/src/lib/service/activity.service";

type ScheduleDates = {
  date: string;
  time: string;
};

export type ActivityCardProps = {
  id: number;
  title: string;
  Dates: ScheduleDates[];
  card_image_url: string;
  type: "event" | "course" | "ceremony";
  status: number;
  filters: FilterType[];
  onDelete: (id: number) => Promise<void>;
  onActivate: (id: number) => Promise<void>;
  onPermanentDelete: (id: number) => Promise<void>;
};

type ActivityContainerProps = {
  onEdit: (activity: ActivityDetails) => void;
};

export default function ActivityContainer({ onEdit }: ActivityContainerProps) {
  const {
    filterOptions,
    activityTypeOptions,
    activities,
    register,
    handleSubmit,
    onSearch,
    currentPage,
    setCurrentPage,
    onDelete,
    onActivate,
    onPermanentDelete,
  } = useActivityContainer();

  const pagination = activities.data;

  return (
    <div className="flex flex-col gap-4 max-w-250">
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
      {/* <ActivitiesList
        activities={activities.data?.data ?? []}
        isLoading={activities.isLoading}
      /> */}
      {activities.isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {activities.data?.data.map((activity) => (
            <ActivityCard
              id={activity.id}
              key={activity.id.toString()}
              title={activity.title}
              type={activity.type}
              status={activity.status}
              Dates={activity.Dates}
              filters={activity.filters}
              card_image_url={activity.card_image_url}
              onDelete={onDelete}
              onEdit={onEdit}
              onActivate={onActivate}
              onPermanentDelete={onPermanentDelete}
            />
          ))}
        </div>
      )}
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
