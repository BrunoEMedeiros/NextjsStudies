import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardReport } from "@/src/lib/service/report.service";

export default function useDashboardReport() {
  const [generated, setGenerated] = useState(false);

  const report = useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: fetchDashboardReport,
    enabled: generated,
    staleTime: 1000 * 60,
  });

  const generate = () => setGenerated(true);

  return {
    generate,
    generated,
    data: report.data,
    isLoading: report.isFetching,
    isError: report.isError,
  };
}
