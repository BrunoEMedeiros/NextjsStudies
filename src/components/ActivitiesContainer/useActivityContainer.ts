// "use client";
// import { fetchAllFilters, FilterType } from "@/src/lib/service/filter.service";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { ActivityTypeSelectOptionProps } from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
// import { fetchAllActivities } from "@/src/lib/service/activity.service";
// import { ActivityCardProps } from "../ActivitiesList/ActivitiesList";

// export default function useActivityContainer() {
//   const [options, setOptions] = useState<ActivityTypeSelectOptionProps[]>([]);

//   const [inputParams, setInputParams] = useState({
//     title: "",
//     filterId: "",
//     dateFrom: "",
//     dateTo: "",
//   });

//   const [appliedParams, setAppliedParams] = useState({});

//   const filters = useQuery<FilterType[]>({
//     queryKey: ["filters_search"],
//     queryFn: () => fetchAllFilters(),
//     staleTime: 1000 * 60 * 5,
//     refetchOnReconnect: false,
//   });

//   const activities = useQuery<ActivityCardProps[]>({
//     queryKey: ["activities", appliedParams],
//     queryFn: () => fetchAllActivities(appliedParams),
//     staleTime: 1000 * 60 * 5,
//     refetchOnReconnect: true,
//   });

//   useEffect(() => {
//     if (filters.data) {
//       setOptions(
//         filters.data.map((filter) => ({
//           label: filter.descricao,
//           key: filter.descricao,
//           value: filter.id.toString(),
//         }))
//       );
//     }
//   }, [filters.data]);

//   const handleFieldChange = (
//     field: keyof typeof inputParams,
//     value: string
//   ) => {
//     setInputParams((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSearch = () => {
//     const params = Object.fromEntries(
//       Object.entries(inputParams).filter(([, v]) => v !== "")
//     );
//     setAppliedParams(params);
//   };

//   return { options, inputParams, handleFieldChange, handleSearch, activities };
// }

import {
  ActivityType,
  fetchAllActivities,
  PaginatedActivitiesResponse,
} from "@/src/lib/service/activity.service";
import { fetchAllFilters, FilterType } from "@/src/lib/service/filter.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityCardProps } from "../ActivitiesList/ActivitiesList";
import { ActivityTypeSelectOptionProps } from "../ActivityTypeSelectOption/ActivityTypeSelectOption";
import { useForm } from "react-hook-form";

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

  return {
    filterOptions,
    activityTypeOptions: ACTIVITY_TYPE_OPTIONS,
    activities,
    register,
    handleSubmit,
    onSearch,
    currentPage,
    setCurrentPage,
  };
}
