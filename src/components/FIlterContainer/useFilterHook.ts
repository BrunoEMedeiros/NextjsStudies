"use client";

import { fetchAllFilters, FilterType } from "@/src/lib/service/filter.service";
import { useQuery } from "@tanstack/react-query";

export function useFiltersHook() {
  const { data, isLoading, error } = useQuery<FilterType[]>({
    queryKey: ["filters"],
    queryFn: () => fetchAllFilters(),
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: false,
  });

  return { filters: data || [] };
}
