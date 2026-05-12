import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCsv } from '@/utils/exportCsv';
import { downloadPdf } from '@/utils/exportPdf';
import type { ExportRow } from '@/utils/exportRow';

interface ExportMenuProps {
  rows: ExportRow[];
}

// Usa a data ISO (YYYY-MM-DD) para que os arquivos ordenem cronologicamente no explorador
function buildFilename(ext: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `leads_export_${date}.${ext}`;
}

export function ExportMenu({ rows }: ExportMenuProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadCsv(rows, buildFilename('csv'))}
      >
        <FileText className="size-4 mr-1.5" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadPdf(rows, buildFilename('pdf'))}
      >
        <FileDown className="size-4 mr-1.5" />
        PDF
      </Button>
    </div>
  );
}
