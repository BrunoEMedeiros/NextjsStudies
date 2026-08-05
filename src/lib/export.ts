import * as XLSX from "xlsx";

function toSheetRows<T extends object>(
  rows: T[],
  columns?: Partial<Record<keyof T, string>>
) {
  if (!columns) return rows;
  return rows.map((row) => {
    const mapped: Record<string, unknown> = {};
    for (const key of Object.keys(columns) as (keyof T)[]) {
      const label = columns[key];
      if (label !== undefined) mapped[label] = row[key];
    }
    return mapped;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function exportToXlsx<T extends object>(
  rows: T[],
  filename: string,
  columns?: Partial<Record<keyof T, string>>
) {
  const sheet = XLSX.utils.json_to_sheet(toSheetRows(rows, columns));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Relatório");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCsv<T extends object>(
  rows: T[],
  filename: string,
  columns?: Partial<Record<keyof T, string>>
) {
  const sheet = XLSX.utils.json_to_sheet(toSheetRows(rows, columns));
  const csv = XLSX.utils.sheet_to_csv(sheet);
  // Prefix a UTF-8 BOM so Excel (which ignores the charset in the MIME type
  // and guesses from the raw bytes) doesn't mangle accented pt-BR text.
  downloadBlob(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
    `${filename}.csv`
  );
}
