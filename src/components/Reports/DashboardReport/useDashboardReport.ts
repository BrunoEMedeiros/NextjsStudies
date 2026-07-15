import { useQuery } from "@tanstack/react-query";
import { fetchDashboardReport } from "@/src/lib/service/report.service";

export default function useDashboardReport() {
  const report = useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: fetchDashboardReport,
    staleTime: 1000 * 60,
  });

  return {
    data: report.data,
    isLoading: report.isFetching,
    isError: report.isError,
  };
}
