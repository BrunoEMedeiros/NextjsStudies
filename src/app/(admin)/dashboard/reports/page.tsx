import { FileBarChart } from "lucide-react";
import ReportsTabs from "@/src/components/Reports/ReportsTabs";

export default function ReportsPage() {
  return (
    <div className="flex flex-col pb-20 px-4 md:px-8 gap-4">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <FileBarChart className="w-5 h-5 text-earth-yellow" />
        Relatórios
      </h1>
      <ReportsTabs />
    </div>
  );
}
