import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EXPORT_HEADERS, type ExportRow } from './exportRow';

export function downloadPdf(rows: ExportRow[], filename: string): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  const keys = Object.keys(EXPORT_HEADERS) as (keyof ExportRow)[];
  const columns = keys.map((k) => ({ header: EXPORT_HEADERS[k], dataKey: k }));
  const body = rows.map((row) => keys.map((k) => row[k] || '—'));

  doc.setFontSize(11);
  doc.text('Leads Enriquecidos', 40, 30);
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 40, 44);

  autoTable(doc, {
    startY: 56,
    head: [columns.map((c) => c.header)],
    body,
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(filename);
}
