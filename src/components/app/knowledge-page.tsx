import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Search, Share2 } from "lucide-react";
import { useSession } from "@/components/app/session";
import {
  getSearchProvider,
  getSuggestedQueries,
  searchKnowledge,
  type KnowledgeCategory,
  type KnowledgeResult,
} from "@/lib/knowledge/search";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/artemis/primitives";
import { toast } from "sonner";
import { DEMO_LABEL } from "@/lib/demo/seed";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<KnowledgeCategory | "All"> = [
  "All",
  "Calls",
  "Moments",
  "Objections",
  "Competitors",
  "Products",
  "Customer questions",
  "Best practices",
  "Playbooks",
  "Market feedback",
];

export function KnowledgePage() {
  const { access, allowed } = useSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory | "All">("All");
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  if (!allowed("knowledge:read")) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-medium">Knowledge unavailable</p>
      </div>
    );
  }

  const provider = getSearchProvider();

  async function runSearch(q: string, cat: KnowledgeCategory | "All" = category) {
    setLoading(true);
    setSearched(true);
    try {
      const rows = await searchKnowledge(access, { query: q, category: cat, limit: 40 });
      setResults(rows);
      track("knowledge_search", { q, category: cat, count: rows.length, mode: provider.mode });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedRaw = window.localStorage.getItem("artemis-knowledge-saved");
    if (savedRaw) setSaved(JSON.parse(savedRaw) as string[]);
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const handle = window.setTimeout(() => {
      void runSearch(query, category);
    }, 320);
    return () => window.clearTimeout(handle);
    // Debounced live search — intentional deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  function toggleSave(id: string) {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    setSaved(next);
    window.localStorage.setItem("artemis-knowledge-saved", JSON.stringify(next));
    toast.success(saved.includes(id) ? "Removed from saved" : "Saved to library");
  }

  function share(item: KnowledgeResult) {
    const text = `${item.title}\n${item.excerpt}`;
    void navigator.clipboard.writeText(text);
    toast.success("Excerpt copied — share link generation coming with deep links.");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Knowledge</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Searchable conversation intelligence across calls, moments, objections, and playbooks.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {DEMO_LABEL} · Search mode: {provider.mode} ({provider.name}) — semantic/vector provider can
        replace this without UI changes.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations, objections, competitors…"
            aria-label="Search knowledge library"
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch(query);
            }}
          />
        </div>
        <Button onClick={() => void runSearch(query)} disabled={loading || !query.trim()}>
          {loading ? "Searching…" : "Search"}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="toolbar" aria-label="Knowledge categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              if (query.trim()) void runSearch(query, c);
            }}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs",
              category === c
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold">Suggested searches</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {getSuggestedQueries().map((s) => (
            <Button
              key={s.label}
              size="sm"
              variant="outline"
              onClick={() => {
                setQuery(s.query);
                setCategory(s.category);
                void runSearch(s.query, s.category);
              }}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Searching conversation library…
          </div>
        ) : !searched ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            Run a search or pick a suggested query to explore the library.
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            No results for “{query}”. Try a broader phrase or another category.
          </div>
        ) : (
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone="artemis">{r.type}</Chip>
                      {r.sentiment ? <Chip tone="neutral">{r.sentiment}</Chip> : null}
                    </div>
                    <h3 className="mt-2 font-medium">{r.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{r.excerpt}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Save"
                      onClick={() => toggleSave(r.id)}
                    >
                      <Bookmark className={cn("size-4", saved.includes(r.id) && "fill-current")} />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Share" onClick={() => share(r)}>
                      <Share2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {r.callId ? (
                    <Link
                      to="/app/calls/$callId"
                      params={{ callId: r.callId }}
                      className="text-primary hover:underline"
                    >
                      Call {r.callId}
                    </Link>
                  ) : null}
                  {r.representativeName ? <span>{r.representativeName}</span> : null}
                  {r.date ? <span>{r.date}</span> : null}
                  {r.timestampSec != null ? (
                    <span>
                      {Math.floor(r.timestampSec / 60)}:
                      {String(r.timestampSec % 60).padStart(2, "0")}
                    </span>
                  ) : null}
                  {r.relatedDealTitle ? <span>Deal: {r.relatedDealTitle}</span> : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
