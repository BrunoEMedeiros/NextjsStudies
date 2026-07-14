import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllActivities } from "@/src/lib/service/activity.service";
import {
  fetchSchedulesReport,
  SchedulesReportFilters,
} from "@/src/lib/service/report.service";

export type SchedulesReportDraft = {
  dateFrom?: string;
  dateTo?: string;
  activityId?: number;
};

export default function useSchedulesReport() {
  const [draft, setDraft] = useState<SchedulesReportDraft>({});
  const [filters, setFilters] = useState<SchedulesReportFilters>({});
  const [generated, setGenerated] = useState(false);

  const activities = useQuery({
    queryKey: ["reports", "schedules-activity-options"],
    queryFn: () => fetchAllActivities(),
    staleTime: 1000 * 60 * 5,
  });

  const report = useQuery({
    queryKey: ["reports", "schedules", filters],
    queryFn: () => fetchSchedulesReport(filters),
    enabled: generated,
  });

  const generate = () => {
    setFilters({
      dateFrom: draft.dateFrom ? new Date(draft.dateFrom) : undefined,
      dateTo: draft.dateTo ? new Date(draft.dateTo) : undefined,
      activityId: draft.activityId,
    });
    setGenerated(true);
  };

  const reset = () => {
    setDraft({});
    setFilters({});
    setGenerated(false);
  };

  return {
    draft,
    setDraft,
    generate,
    reset,
    generated,
    activityOptions: activities.data?.data ?? [],
    schedules: report.data,
    isLoading: report.isFetching,
    isError: report.isError,
  };
}
