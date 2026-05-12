import { EXPORT_HEADERS, type ExportRow } from './exportRow';

function escapeCell(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(rows: ExportRow[], filename: string): void {
  const keys = Object.keys(EXPORT_HEADERS) as (keyof ExportRow)[];
  const header = keys.map((k) => escapeCell(EXPORT_HEADERS[k])).join(';');
  const body = rows
    .map((row) => keys.map((k) => escapeCell(row[k])).join(';'))
    .join('\n');

  // BOM + UTF-8 for Excel compatibility
  const bom = '﻿';
  const blob = new Blob([bom + header + '\n' + body], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
