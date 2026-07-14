"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { exportToCsv, exportToXlsx } from "@/src/lib/export";

type ExportButtonsProps<T extends object> = {
  data: T[] | undefined;
  filename: string;
  columns?: Partial<Record<keyof T, string>>;
};

export default function ExportButtons<T extends object>({
  data,
  filename,
  columns,
}: ExportButtonsProps<T>) {
  const disabled = !data || data.length === 0;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => data && exportToXlsx(data, filename, columns)}
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => data && exportToCsv(data, filename, columns)}
      >
        <FileText className="w-3.5 h-3.5" />
        CSV
      </Button>
    </div>
  );
}
