import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, CalendarDays, ChevronDown } from "lucide-react";
import { ProductMark, StatusBadge } from "@/components/product/ui";
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

function isNavActive(pathname: string, to: string) {
  if (to === "/demo/ceo" || to === "/demo/manager" || to === "/demo/agent") {
    return pathname === to || pathname === `${to}/`;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

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
    <div className="artemis-product min-h-screen w-full">
      <div className="mx-auto flex w-full">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0A182C] px-3 py-5 lg:flex">
          <Link to="/demo" className="px-2 py-1">
            <ProductMark />
          </Link>

          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#132742]/70 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-semibold text-[#F7FAFF]">{DEMO_COMPANY.name}</p>
              <StatusBadge tone="demo">Demo</StatusBadge>
            </div>
            <p className="mt-1 text-[11px] text-[#8A9BB5]">Workspace · Limassol</p>
          </div>

          <p className="mt-6 px-2 text-[10px] font-semibold tracking-[0.16em] text-[#8A9BB5] uppercase">
            {workspace}
          </p>

          <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4">
            {nav.map((item, index) => {
              const showSection =
                item.section && (index === 0 || nav[index - 1]?.section !== item.section);
              const active = isNavActive(pathname, item.to);
              const Icon = item.icon;
              return (
                <div key={`${item.to}-${item.label}`}>
                  {showSection ? (
                    <p className="mt-4 mb-1.5 px-2 text-[10px] font-semibold tracking-[0.14em] text-[#8A9BB5] uppercase">
                      {item.section}
                    </p>
                  ) : null}
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] transition-colors",
                      active
                        ? "bg-[#2EE6A6]/12 text-[#F7FAFF]"
                        : "text-[#8A9BB5] hover:bg-white/[0.04] hover:text-[#F7FAFF]",
                    )}
                  >
                    <Icon
                      className={cn("size-4 shrink-0", active ? "text-[#2EE6A6]" : "text-[#8A9BB5]")}
                    />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/[0.07] px-2 pt-4">
            <p className="text-[12px] font-medium text-[#F7FAFF]">{meta.user}</p>
            <p className="text-[11px] text-[#8A9BB5]">{meta.title}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0B1B33]/90 px-4 py-3.5 backdrop-blur-md md:px-8">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#F7FAFF]">{meta.user}</p>
              <p className="truncate text-[12px] text-[#8A9BB5]">{meta.title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#8A9BB5] sm:inline-flex"
              >
                <CalendarDays className="size-3.5" />
                Today
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full border border-white/10 text-[#8A9BB5] hover:text-[#F7FAFF]"
                aria-label="Notifications"
              >
                <Bell className="size-3.5" />
              </button>
              <StatusBadge tone="demo">Demo Workspace</StatusBadge>
              <StatusBadge tone="ai">Simulated AI</StatusBadge>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-[#F7FAFF]"
                >
                  Viewing as: {meta.label}
                  <ChevronDown className="size-3.5 text-[#8A9BB5]" />
                </button>
                {open ? (
                  <div className="absolute right-0 z-40 mt-1.5 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#152A45] shadow-xl">
                    {(Object.keys(ROLE_META) as DemoRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={cn(
                          "block w-full px-3 py-2.5 text-left text-[13px] hover:bg-white/[0.04]",
                          r === role && "bg-[#2EE6A6]/10 text-[#2EE6A6]",
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
              <Link to="/demo" className="product-btn-ghost text-[12px]">
                Demo home
              </Link>
            </div>
          </header>

          <div className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-3 py-2 lg:hidden">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(pathname, item.to);
              return (
                <Link
                  key={`${item.to}-${item.label}`}
                  to={item.to}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[12px]",
                    active ? "bg-[#2EE6A6]/12 text-[#F7FAFF]" : "text-[#8A9BB5]",
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-7 md:px-8 md:py-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function DemoLoading({ label = "Loading demo data…" }: { label?: string }) {
  return <p className="text-[14px] text-[#8A9BB5]">{label}</p>;
}

export function DemoPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-8", className)}>{children}</div>;
}
