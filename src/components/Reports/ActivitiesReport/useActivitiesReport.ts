import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ActivitiesReportFilters,
  ActivityType,
  fetchActivitiesReport,
} from "@/src/lib/service/report.service";
import { fetchAllFilters } from "@/src/lib/service/filter.service";

export type ActivitiesReportDraft = {
  dateFrom?: string;
  dateTo?: string;
  type?: ActivityType;
  paymentRequired?: boolean;
  description?: string;
  filterIds: number[];
};

export default function useActivitiesReport() {
  const [draft, setDraft] = useState<ActivitiesReportDraft>({
    filterIds: [],
  });
  const [filters, setFilters] = useState<ActivitiesReportFilters>({});
  const [generated, setGenerated] = useState(false);

  const filterOptions = useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchAllFilters(),
    staleTime: 1000 * 60 * 5,
  });

  const report = useQuery({
    queryKey: ["reports", "activities", filters],
    queryFn: () => fetchActivitiesReport(filters),
    enabled: generated,
  });

  const toggleFilterId = (id: number) => {
    setDraft((p) => ({
      ...p,
      filterIds: p.filterIds.includes(id)
        ? p.filterIds.filter((f) => f !== id)
        : [...p.filterIds, id],
    }));
  };

  const generate = () => {
    setFilters({
      dateFrom: draft.dateFrom ? new Date(draft.dateFrom) : undefined,
      dateTo: draft.dateTo ? new Date(draft.dateTo) : undefined,
      type: draft.type,
      paymentRequired: draft.paymentRequired,
      description: draft.description,
      filterIds: draft.filterIds,
    });
    setGenerated(true);
  };

  const reset = () => {
    setDraft({ filterIds: [] });
    setFilters({});
    setGenerated(false);
  };

  return {
    draft,
    setDraft,
    toggleFilterId,
    filterOptions: filterOptions.data ?? [],
    generate,
    reset,
    generated,
    activities: report.data,
    isLoading: report.isFetching,
    isError: report.isError,
  };
}
