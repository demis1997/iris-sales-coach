import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Building2,
  ChevronDown,
  Dna,
  Gauge,
  Menu,
  Radio,
  Shield,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ArtemisButton, ArtemisMark } from "@/components/relay/brand";
import { CONTACT_MAILTO } from "@/components/relay/contact";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type NavColumn = {
  title: string;
  links: NavLink[];
};

type NavItem =
  | { label: string; href: string; columns?: never; featured?: never }
  | { label: string; href?: string; columns: NavColumn[]; featured?: NavLink[] };

const NAV: NavItem[] = [
  {
    label: "Platform",
    featured: [
      {
        label: "Revenue Loop",
        href: "#revenue-loop",
        description: "Every conversation improves the business.",
        icon: Zap,
      },
      {
        label: "Rep DNA™",
        href: "#rep-dna",
        description: "Continuously evolving sales behaviour profiles.",
        icon: Dna,
      },
      {
        label: "Live AI Copilot",
        href: "#copilot",
        description: "Assistance during the conversation — not after.",
        icon: Radio,
      },
      {
        label: "Operations Center",
        href: "#operations",
        description: "The manager operating system.",
        icon: Users,
      },
      {
        label: "Revenue Command Center",
        href: "#command",
        description: "Executive forecast, risk, and weekly action.",
        icon: Gauge,
      },
    ],
    columns: [
      {
        title: "Intelligence",
        links: [
          {
            label: "Company Memory",
            href: "#company-brain",
            description: "Institutional knowledge from every call.",
            icon: Brain,
          },
          {
            label: "Knowledge Engine",
            href: "#knowledge",
            description: "Teach Artemis once. Improve everyone forever.",
            icon: BookOpen,
          },
          {
            label: "Roleplay & Certification",
            href: "#roleplay",
            description: "Practice before customers. Not after.",
            icon: Bot,
          },
        ],
      },
      {
        title: "Outcomes",
        links: [
          {
            label: "Revenue Intelligence",
            href: "#capabilities",
            description: "What converts, what stalls, and why.",
            icon: BarChart3,
          },
          {
            label: "Continuous Coaching",
            href: "#capabilities",
            description: "Every rep improves after every call.",
            icon: Sparkles,
          },
          {
            label: "Category shift",
            href: "#comparison",
            description: "Why Artemis is infrastructure — not a tool.",
            icon: Target,
          },
        ],
      },
    ],
  },
  {
    label: "Markets",
    columns: [
      {
        title: "High-volume sales",
        links: [
          { label: "Forex", href: "#markets", description: "Our first market — not our only one." },
          { label: "Insurance", href: "#markets" },
          { label: "Real Estate", href: "#markets" },
          { label: "Solar", href: "#markets" },
          { label: "SaaS Sales", href: "#markets" },
          { label: "Recruiting", href: "#markets" },
        ],
      },
      {
        title: "Operations at scale",
        links: [
          { label: "BPOs", href: "#markets" },
          { label: "Call Centers", href: "#markets" },
          { label: "Mortgage", href: "#markets" },
          { label: "Financial Services", href: "#markets" },
        ],
      },
    ],
  },
  { label: "Why Artemis", href: "#why" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "Company",
    columns: [
      {
        title: "About",
        links: [
          {
            label: "Forex product demo",
            href: "/demo",
            description: "CEO, manager & agent views for a forex floor.",
            icon: Gauge,
          },
          {
            label: "Trust",
            href: "#security",
            description: "Tenant isolation and evidence-based AI.",
            icon: Shield,
          },
          {
            label: "Contact Sales",
            href: CONTACT_MAILTO,
            description: "Talk to a solutions specialist.",
            icon: Building2,
          },
        ],
      },
    ],
  },
];

export function ArtemisHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setDesktopOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDesktopOpen(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EEF7] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" aria-label="Artemis AI home" onClick={() => setDesktopOpen(null)}>
          <ArtemisMark />
        </Link>

        <nav ref={navRef} className="relative hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((item) => {
            const hasMenu = Boolean(item.columns || item.featured);
            const isOpen = desktopOpen === item.label;

            if (!hasMenu) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5C76] transition-colors hover:bg-[#F7FAFF] hover:text-[#0B1B33]"
                  onClick={() => setDesktopOpen(null)}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDesktopOpen(item.label)}
                onMouseLeave={() => setDesktopOpen(null)}
              >
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isOpen ? "bg-[#F7FAFF] text-[#0B1B33]" : "text-[#4B5C76] hover:bg-[#F7FAFF] hover:text-[#0B1B33]",
                  )}
                  aria-expanded={isOpen}
                  onClick={() => setDesktopOpen(isOpen ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
                </button>
                <div
                  className={cn(
                    "absolute top-full left-1/2 z-50 pt-2 transition-all",
                    isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                  )}
                  style={{ transform: "translateX(-50%)" }}
                >
                  <MegaMenu
                    item={item as Extract<NavItem, { columns: NavColumn[] }>}
                    onNavigate={() => setDesktopOpen(null)}
                  />
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/demo" className="text-sm font-medium text-[#4B5C76] hover:text-[#0B1B33]">
            Product Demo
          </Link>
          <Link to="/app" className="text-sm font-medium text-[#4B5C76] hover:text-[#0B1B33]">
            Log In
          </Link>
          <ArtemisButton href="#get-started">Book Demo</ArtemisButton>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg text-[#0B1B33] lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-[#E8EEF7] bg-white lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto max-w-6xl space-y-1 px-5 py-4">
          {NAV.map((item) => {
            const hasMenu = Boolean(item.columns || item.featured);
            if (!hasMenu) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0B1B33]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              );
            }
            const open = mobileSection === item.label;
            return (
              <div key={item.label} className="rounded-xl border border-[#E8EEF7]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-[#0B1B33]"
                  onClick={() => setMobileSection(open ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
                </button>
                {open ? (
                  <div className="space-y-3 border-t border-[#E8EEF7] px-3 py-3">
                    {item.featured?.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="block"
                        onClick={() => setMobileOpen(false)}
                      >
                        <p className="text-sm font-semibold text-[#0B1B33]">{link.label}</p>
                        {link.description ? (
                          <p className="mt-0.5 text-xs text-[#8A9BB5]">{link.description}</p>
                        ) : null}
                      </a>
                    ))}
                    {item.columns?.map((col) => (
                      <div key={col.title}>
                        <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#8A9BB5] uppercase">
                          {col.title}
                        </p>
                        <div className="space-y-2">
                          {col.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              className="block text-sm text-[#4B5C76]"
                              onClick={() => setMobileOpen(false)}
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div className="flex gap-2 pt-2">
            <Link
              to="/demo"
              className="flex-1 rounded-full border border-[#D7E0EF] px-4 py-2.5 text-center text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Forex Demo
            </Link>
            <Link
              to="/app"
              className="flex-1 rounded-full border border-[#D7E0EF] px-4 py-2.5 text-center text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
          </div>
          <ArtemisButton href="#get-started" className="w-full">
            Book Demo
          </ArtemisButton>
        </div>
      </div>
    </header>
  );
}

function MegaMenu({
  item,
  onNavigate,
}: {
  item: Extract<NavItem, { columns: NavColumn[] }>;
  onNavigate: () => void;
}) {
  return (
    <div className="w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white shadow-[0_30px_80px_-28px_rgba(15,40,80,0.45)]">
      {item.featured ? (
        <div className="grid gap-2 border-b border-[#E8EEF7] bg-[#F7FAFF] p-4 sm:grid-cols-2">
          {item.featured.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onNavigate}
              className="flex gap-3 rounded-xl bg-white p-3 transition hover:shadow-sm"
            >
              {link.icon ? (
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#E8FFF6] text-[#12C48A]">
                  <link.icon className="size-4" />
                </span>
              ) : null}
              <span>
                <span className="block text-sm font-semibold text-[#0B1B33]">{link.label}</span>
                {link.description ? (
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#8A9BB5]">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </a>
          ))}
        </div>
      ) : null}

      {item.columns ? (
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold tracking-wide text-[#8A9BB5] uppercase">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-2 py-1.5 transition hover:bg-[#F7FAFF]"
                    >
                      <span className="flex items-start gap-2">
                        {link.icon ? <link.icon className="mt-0.5 size-3.5 text-[#12C48A]" /> : null}
                        <span>
                          <span className="block text-sm font-medium text-[#0B1B33]">{link.label}</span>
                          {link.description ? (
                            <span className="mt-0.5 block text-xs leading-relaxed text-[#8A9BB5]">
                              {link.description}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-[#E8EEF7] bg-[#F7FAFF] px-5 py-3">
        <p className="text-xs text-[#8A9BB5]">The AI Operating System for revenue teams.</p>
        <a
          href="#get-started"
          onClick={onNavigate}
          className="shrink-0 text-xs font-semibold text-[#12C48A] hover:underline"
        >
          Book Demo →
        </a>
      </div>
    </div>
  );
}
