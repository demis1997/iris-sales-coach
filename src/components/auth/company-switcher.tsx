import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { switchActiveCompany } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

export function CompanySwitcher({ className }: { className?: string }) {
  const { session, demoMode, refresh } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (demoMode || !session || session.memberships.length < 1) return null;

  const current = session.membership;

  async function select(companyId: string) {
    if (companyId === session?.activeCompanyId) {
      setOpen(false);
      return;
    }
    setBusy(true);
    try {
      await switchActiveCompany(companyId);
      await refresh();
      await queryClient.invalidateQueries();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not switch company");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-xs text-foreground"
      >
        <Building2 className="size-3.5 shrink-0 text-primary" />
        <span className="truncate">{current?.companyName ?? "Company"}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-40 mt-1 min-w-[240px] rounded-xl border border-border bg-background p-1 shadow-xl">
          {session.memberships.map((m) => (
            <button
              key={m.companyId}
              type="button"
              onClick={() => void select(m.companyId)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-secondary/50"
            >
              <span className="min-w-0 flex-1 truncate">
                <span className="block font-medium">{m.companyName}</span>
                <span className="text-muted-foreground">{m.role}</span>
              </span>
              {m.companyId === session.activeCompanyId ? (
                <Check className="size-3.5 text-primary" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
