/** CSV / printable report helpers — no third-party PDF SDK required. */

export function toCsv(rows: Record<string, string | number | boolean | null | undefined>[]) {
  if (!rows.length) return "message\nNo rows\n";
  const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join(
    "\n",
  );
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(
  filename: string,
  rows: Record<string, string | number | boolean | null | undefined>[],
) {
  downloadText(filename, toCsv(rows), "text/csv;charset=utf-8");
}

/** Lightweight printable PDF substitute — opens print dialog with report HTML. */
export function openPrintableReport(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
  if (!w) return false;
  w.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,sans-serif;padding:32px;color:#111;line-height:1.45}
      h1{font-size:20px;margin:0 0 8px} .meta{color:#666;font-size:12px;margin-bottom:24px}
      table{border-collapse:collapse;width:100%;font-size:12px}
      th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
      th{background:#f5f5f5}
      .note{margin-top:24px;font-size:11px;color:#666}
    </style></head><body>
    <h1>${title}</h1>
    <p class="meta">Illustrative demo data · Generated ${new Date().toISOString()}</p>
    ${bodyHtml}
    <p class="note">This printable view is a PDF-export stand-in until a dedicated PDF pipeline is connected.</p>
    <script>window.onload=()=>window.print()</script>
    </body></html>`);
  w.document.close();
  return true;
}

const VIEWS_KEY = "artemis-report-saved-views";

export type SavedReportView = {
  id: string;
  name: string;
  reportId: string;
  teamId: string;
  representativeId: string;
  dateRange: string;
  createdAt: string;
};

export function listSavedViews(): SavedReportView[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(VIEWS_KEY) ?? "[]") as SavedReportView[];
  } catch {
    return [];
  }
}

export function saveReportView(view: Omit<SavedReportView, "id" | "createdAt">) {
  const list = listSavedViews();
  const next: SavedReportView = {
    ...view,
    id: `view-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(next);
  window.localStorage.setItem(VIEWS_KEY, JSON.stringify(list.slice(0, 20)));
  return next;
}
