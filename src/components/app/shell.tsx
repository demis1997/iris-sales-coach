import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Brain,
  Cable,
  CalendarRange,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageSquareText,
  PhoneCall,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArtemisMark } from "@/components/artemis/app-shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/components/app/session";
import { AskArtemisPanel } from "@/components/app/ask-artemis";
import { roleLabel, can } from "@/lib/demo/rbac";
import type { Permission } from "@/lib/demo/permissions";
import type { Role } from "@/lib/demo/types";
import { teams } from "@/lib/demo/seed";
import { cn } from "@/lib/utils";
import { DEMO_LABEL } from "@/lib/demo/seed";

type NavDef = {
  label: string;
  to: string;
  icon: LucideIcon;
  anyOf: Permission[];
};

const NAV: NavDef[] = [
  {
    label: "Overview",
    to: "/app",
    icon: LayoutDashboard,
    anyOf: ["overview:own", "overview:team", "overview:org"],
  },
  {
    label: "Calls",
    to: "/app/calls",
    icon: PhoneCall,
    anyOf: ["calls:own", "calls:team", "calls:org"],
  },
  {
    label: "Coaching",
    to: "/app/coaching",
    icon: Sparkles,
    anyOf: ["coaching:own", "coaching:team", "coaching:org"],
  },
  { label: "Team", to: "/app/team", icon: Users, anyOf: ["team:read"] },
  {
    label: "Pipeline",
    to: "/app/pipeline",
    icon: Target,
    anyOf: ["pipeline:team", "pipeline:org"],
  },
  { label: "Playbooks", to: "/app/playbooks", icon: BookOpen, anyOf: ["playbooks:read"] },
  {
    label: "Training",
    to: "/app/training",
    icon: GraduationCap,
    anyOf: ["training:own", "training:team", "training:org"],
  },
  { label: "Knowledge", to: "/app/knowledge", icon: Brain, anyOf: ["knowledge:read"] },
  { label: "Reports", to: "/app/reports", icon: LineChart, anyOf: ["reports:team", "reports:org"] },
  { label: "Integrations", to: "/app/integrations", icon: Cable, anyOf: ["integrations:manage"] },
  {
    label: "Settings",
    to: "/app/settings",
    icon: Settings,
    anyOf: [
      "settings:org",
      "settings:security",
      "settings:billing",
      "users:manage",
      "overview:own",
    ],
  },
];

export function ProductShell() {
  const {
    user,
    role,
    filters,
    setDateRange,
    setTeamId,
    setRole,
    organisationName,
    allowed,
    logout,
  } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const navigate = useNavigate();

  const nav = useMemo(() => NAV.filter((item) => item.anyOf.some((p) => allowed(p))), [allowed]);

  const canFilterTeams = allowed("overview:org") || allowed("calls:org") || allowed("pipeline:org");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex w-full">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <div className="flex items-center gap-2 px-4 py-4">
            <Link to="/" aria-label="Artemis marketing site">
              <ArtemisMark />
            </Link>
          </div>
          <p className="px-4 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            {organisationName}
          </p>
          <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-2" aria-label="Product">
            {nav.map((item) => {
              const active =
                item.to === "/app"
                  ? pathname === "/app" || pathname === "/app/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )}
                >
                  <item.icon className={cn("size-4", active && "text-primary")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-border p-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-border bg-secondary/30 px-2.5 py-2 text-left text-xs"
            >
              <span>
                <span className="block text-muted-foreground">Organisation</span>
                <span className="font-medium">{organisationName}</span>
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            >
              <CircleHelp className="size-3.5" /> Help & support
            </Link>
            <div className="flex items-center gap-2 rounded-md px-2.5 py-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{user.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{roleLabel(role)}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar p-3 shadow-xl">
              <div className="mb-3 flex items-center justify-between px-1">
                <ArtemisMark />
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X className="size-4" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 overflow-y-auto">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
            <div className="flex h-14 items-center gap-2 px-3 lg:px-6">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-md border border-border lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-4" />
              </button>

              <div className="hidden items-center gap-2 md:flex">
                <Select
                  value={filters.dateRange}
                  onValueChange={(v) => setDateRange(v as typeof filters.dateRange)}
                >
                  <SelectTrigger className="h-9 w-[140px]" aria-label="Date range">
                    <CalendarRange className="mr-1 size-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="quarter">This quarter</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.teamId} onValueChange={setTeamId} disabled={!canFilterTeams}>
                  <SelectTrigger className="h-9 w-[160px]" aria-label="Team">
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All teams</SelectItem>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <button
                type="button"
                className="ml-1 hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2 text-left text-sm text-muted-foreground sm:flex sm:max-w-md"
                onClick={() => navigate({ to: "/app/calls" })}
              >
                <Search className="size-3.5 shrink-0" />
                <span className="truncate">Search calls, reps, objections…</span>
              </button>

              <div className="ml-auto flex items-center gap-2">
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-9 w-[150px] text-xs" aria-label="Demo role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      ["representative", "manager", "director", "executive", "admin"] as Role[]
                    ).map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  type="button"
                  className="relative grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                </button>

                {can(role, "ask_artemis") ? (
                  <Button size="sm" onClick={() => setAskOpen(true)}>
                    <MessageSquareText className="size-3.5" />
                    Ask Artemis
                  </Button>
                ) : null}
              </div>
            </div>
            <p className="border-t border-border px-3 py-1 text-[10px] text-muted-foreground lg:px-6">
              {DEMO_LABEL} · Role switcher is for demo permissions only ·{" "}
              <Link to="/onboarding" className="underline-offset-2 hover:underline">
                Onboarding
              </Link>
              {" · "}
              <button
                type="button"
                className="underline-offset-2 hover:underline"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                Log out
              </button>
            </p>
          </header>

          <main className="px-3 py-5 lg:px-6 lg:py-6">
            <Outlet />
          </main>
        </div>
      </div>

      <AskArtemisPanel open={askOpen} onOpenChange={setAskOpen} />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}
