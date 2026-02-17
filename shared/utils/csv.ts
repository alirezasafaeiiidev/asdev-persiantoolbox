export type CsvPrimitive = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvPrimitive>;

function toCell(value: CsvPrimitive): string {
  const normalized = value ?? '';
  const text = typeof normalized === 'string' ? normalized : String(normalized);
  const escaped = text.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function buildCsvContent(rows: CsvRow[], headers?: string[]): string {
  const resolvedHeaders =
    headers && headers.length > 0
      ? headers
      : Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  const lines = [resolvedHeaders.map((header) => toCell(header)).join(',')];

  for (const row of rows) {
    lines.push(resolvedHeaders.map((header) => toCell(row[header])).join(','));
  }

  return `\uFEFF${lines.join('\n')}`;
}

export function downloadCsv(filename: string, rows: CsvRow[], headers?: string[]): void {
  if (!rows.length) {
    return;
  }

  const csv = buildCsvContent(rows, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
