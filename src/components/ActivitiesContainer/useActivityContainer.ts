import {
  ActivityType,
  fetchAllActivities,
  handleActivateActivity,
  handleDeleteActivity,
  PaginatedActivitiesResponse,
} from "@/src/lib/service/activity.service";
import { fetchAllFilters, FilterType } from "@/src/lib/service/filter.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import { ActivityCardProps } from "../ActivitiesList/ActivitiesList";
import { ActivityTypeSelectOptionProps } from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type ActivityFilterForm = {
  title: string;
  filterId: string;
  type: ActivityType | "";
  dateFrom: string;
  dateTo: string;
};

export const ACTIVITY_TYPE_OPTIONS = [
  { label: "Todos", key: "", value: "" },
  { label: "Evento", key: "event", value: "event" },
  { label: "Curso", key: "course", value: "course" },
  { label: "Cerimônia", key: "ceremony", value: "ceremony" },
] satisfies ActivityTypeSelectOptionProps[];

export default function useActivityContainer() {
  const queryClient = useQueryClient();

  const [filterOptions, setFilterOptions] = useState<
    ActivityTypeSelectOptionProps[]
  >([]);
  const [appliedParams, setAppliedParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit } = useForm<ActivityFilterForm>({
    defaultValues: {
      title: "",
      filterId: "",
      type: "",
      dateFrom: "",
      dateTo: "",
    },
  });

  const filters = useQuery<FilterType[]>({
    queryKey: ["filters_search"],
    queryFn: () => fetchAllFilters(),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
  });

  const activities = useQuery<PaginatedActivitiesResponse>({
    queryKey: ["activities", appliedParams, currentPage],
    queryFn: () => fetchAllActivities({ ...appliedParams, page: currentPage }),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
  });

  const deleteActivity = useMutation({
    mutationKey: ["deleteActivity"],
    mutationFn: (id: number) => handleDeleteActivity(id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Erro ao excluir atividade");

        return;
      }
      toast.success("Atividade excluida com sucesso");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const activateActivity = useMutation({
    mutationKey: ["activateActivity"],
    mutationFn: (id: number) => handleActivateActivity(id),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Erro ao ativar atividade");
        return;
      }
      toast.success("Atividade reativada");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  useEffect(() => {
    if (filters.data) {
      setFilterOptions(
        filters.data.map((filter) => ({
          label: filter.descricao,
          key: filter.descricao,
          value: filter.id.toString(),
        }))
      );
    }
  }, [filters.data]);

  const onSearch = (data: ActivityFilterForm) => {
    const params = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "")
    );
    setAppliedParams(params);
    setCurrentPage(1);
  };

  const onDelete = async (id: number) => {
    await deleteActivity.mutateAsync(id);
  };

  const onActivate = async (id: number) => {
    await activateActivity.mutateAsync(id);
  };

  return {
    filterOptions,
    activityTypeOptions: ACTIVITY_TYPE_OPTIONS,
    activities,
    register,
    handleSubmit,
    onSearch,
    currentPage,
    setCurrentPage,
    onDelete,
    onActivate,
  };
}
