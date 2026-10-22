'use client';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
    >
      <Printer className="size-3.5" /> 인쇄 / PDF
    </button>
  );
}
