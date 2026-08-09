import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ArtemisMark } from "@/components/iris/app-shell";
import { Chip } from "@/components/iris/primitives";
import { DEMO_COMPANY } from "@/data/demo/company";
import type { DemoRole } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

export type DemoNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  section?: string;
};

const ROLE_META: Record<DemoRole, { label: string; path: string; user: string; title: string }> = {
  ceo: { label: "CEO", path: "/demo/ceo", user: DEMO_COMPANY.ceo.name, title: "CEO" },
  manager: {
    label: "Sales Manager",
    path: "/demo/manager",
    user: "Sarah Mitchell",
    title: "Sales Manager · Alpha Desk",
  },
  agent: {
    label: "Sales Agent",
    path: "/demo/agent",
    user: "Maria Georgiou",
    title: "Sales Agent · Alpha Desk",
  },
};

export function DemoShell({
  role,
  nav,
  workspace,
}: {
  role: DemoRole;
  nav: DemoNavItem[];
  workspace: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[role];

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
          <Link to="/demo" className="px-2 py-1">
            <ArtemisMark />
          </Link>
          <div className="mt-3 px-2">
            <Chip tone="iris">Demo Workspace</Chip>
            <p className="mt-2 text-[11px] text-muted-foreground">{DEMO_COMPANY.name} · Limassol</p>
          </div>
          <p className="mt-6 px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {workspace}
          </p>
          <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4">
            {nav.map((item, index) => {
              const showSection = item.section && (index === 0 || nav[index - 1]?.section !== item.section);
              const active =
                pathname === item.to ||
                (item.to !== "/demo/ceo" &&
                  item.to !== "/demo/manager" &&
                  item.to !== "/demo/agent" &&
                  pathname.startsWith(`${item.to}/`)) ||
                (item.to === "/demo/ceo" && (pathname === "/demo/ceo" || pathname === "/demo/ceo/")) ||
                (item.to === "/demo/manager" &&
                  (pathname === "/demo/manager" || pathname === "/demo/manager/")) ||
                (item.to === "/demo/agent" && (pathname === "/demo/agent" || pathname === "/demo/agent/"));
              const Icon = item.icon;
              return (
                <div key={item.to}>
                  {showSection ? (
                    <p className="mt-3 mb-1 px-2 text-[10px] tracking-wider text-muted-foreground uppercase">
                      {item.section}
                    </p>
                  ) : null}
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{meta.user}</p>
              <p className="truncate text-xs text-muted-foreground">{meta.title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="neutral">Example data · Simulated AI</Chip>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium"
                >
                  View as: {meta.label}
                  <ChevronDown className="size-3.5" />
                </button>
                {open ? (
                  <div className="absolute right-0 z-40 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    {(Object.keys(ROLE_META) as DemoRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={cn(
                          "block w-full px-3 py-2 text-left text-sm hover:bg-secondary",
                          r === role && "bg-primary/10",
                        )}
                        onClick={() => {
                          setOpen(false);
                          void navigate({ to: ROLE_META[r].path });
                        }}
                      >
                        {ROLE_META[r].label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link to="/demo" className="text-xs text-primary hover:underline">
                Demo home
              </Link>
            </div>
          </header>

          <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 lg:hidden">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs",
                    active ? "bg-primary/15" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function DemoLoading({ label = "Loading demo data…" }: { label?: string }) {
  return <p className="text-sm text-muted-foreground">{label}</p>;
}

export function DemoPage({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
