import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Search, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Optional sidebar section label shown above this item when it changes */
  section?: string;
};

export function ArtemisMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src="/artemis-mark.png?v=artemis"
        alt=""
        width={28}
        height={28}
        className="size-7 rounded-lg object-cover"
      />
      <span className="text-[15px] font-semibold tracking-tight">
        Artemis <span className="text-primary">AI</span>
      </span>
    </span>
  );
}

/** @deprecated use ArtemisMark */
export const IrisMark = ArtemisMark;

const WORKSPACES = [
  { label: "Rep", to: "/app" },
  { label: "Manager", to: "/manager" },
  { label: "CRM", to: "/crm" },
  { label: "Executive", to: "/ceo" },
] as const;

export function AppShell({
  nav,
  workspace,
  user,
}: {
  nav: NavItem[];
  workspace: string;
  user: { name: string; role: string };
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
          <Link to="/" className="px-2 py-1">
            <ArtemisMark />
          </Link>
          <p className="mt-6 px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {workspace}
          </p>
          <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4">
            {nav.map((item, index) => {
              const showSection = item.section && (index === 0 || nav[index - 1]?.section !== item.section);
              const active =
                pathname === item.to ||
                (item.to !== "/app" &&
                  item.to !== "/ceo" &&
                  item.to !== "/manager" &&
                  item.to !== "/crm" &&
                  pathname.startsWith(item.to)) ||
                (item.to === "/app" && pathname === "/app/") ||
                (item.to === "/ceo" && (pathname === "/ceo" || pathname === "/ceo/")) ||
                (item.to === "/manager" && (pathname === "/manager" || pathname === "/manager/")) ||
                (item.to === "/crm" && (pathname === "/crm" || pathname === "/crm/"));
              return (
                <div key={item.to}>
                  {showSection ? (
                    <p className="mt-4 mb-1 px-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground/80 uppercase first:mt-1">
                      {item.section}
                    </p>
                  ) : null}
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                    )}
                  >
                    <item.icon className={cn("size-4", active && "text-primary")} />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto">
            <div className="gradient-border rounded-xl bg-secondary/40 p-3">
              <p className="text-xs font-medium">AI Revenue OS</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Live coach → DNA → coaching → deal outcomes
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[64%] rounded-full gradient-surface" />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
            <Link to="/" className="lg:hidden">
              <ArtemisMark />
            </Link>
            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground sm:flex sm:max-w-sm">
              <Search className="size-3.5" />
              <span className="truncate">Search calls, reps, deals, objections…</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-1 rounded-lg border border-border p-0.5 sm:flex">
                {WORKSPACES.map((w) => {
                  const on =
                    pathname === w.to ||
                    pathname.startsWith(w.to + "/") ||
                    (w.to === "/app" && pathname.startsWith("/app"));
                  return (
                    <Link
                      key={w.to}
                      to={w.to}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] transition-colors",
                        on ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {w.label}
                    </Link>
                  );
                })}
              </div>
              <button className="relative text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="size-4" />
                <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
              </button>
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full gradient-surface text-[11px] font-semibold text-background">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-medium">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </div>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap text-muted-foreground [&.active]:bg-sidebar-accent [&.active]:text-foreground"
                activeProps={{ className: "active" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <main className="px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
