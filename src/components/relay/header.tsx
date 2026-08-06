import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  ChevronDown,
  Code2,
  Headphones,
  Menu,
  MessageSquare,
  PhoneCall,
  Shield,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { RelayButton, RelayMark } from "@/components/relay/brand";
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
    label: "Products",
    featured: [
      {
        label: "Omnichannel",
        href: "#omnichannel",
        description: "Unify voice, messaging apps, and SMS in one workspace.",
        icon: MessageSquare,
      },
      {
        label: "AI Predictive Dialer",
        href: "#dialer",
        description: "Automate dialing, cut idle time, maximize contact rates.",
        icon: PhoneCall,
      },
      {
        label: "Flow Builder",
        href: "#flow",
        description: "Design IVR, routing, and chatbots with no code.",
        icon: Workflow,
      },
      {
        label: "AI Speech Analytics",
        href: "#speech",
        description: "Transcribe, score, and summarize every conversation.",
        icon: Sparkles,
      },
      {
        label: "Real-Time Dashboards",
        href: "#products",
        description: "Watch 60+ performance metrics unfold live.",
        icon: BarChart3,
      },
    ],
    columns: [
      {
        title: "Voice & outreach",
        links: [
          { label: "AI AMD", href: "#dialer", description: "Skip voicemail, connect to live contacts." },
          { label: "Local Caller ID", href: "#dialer", description: "Boost answer rates in 120+ countries." },
          { label: "Number Validator", href: "#dialer", description: "Clean lists before you dial." },
        ],
      },
      {
        title: "Automation",
        links: [
          { label: "Chatbot", href: "#flow", description: "Instant support across digital channels." },
          { label: "IVR", href: "#flow", description: "Visual voice menus in minutes." },
          { label: "Call Queuing", href: "#flow", description: "Intelligent queues that cut wait times." },
        ],
      },
      {
        title: "Intelligence",
        links: [
          { label: "Call Transcription", href: "#speech", description: "Searchable transcripts in 10+ languages." },
          { label: "AI Call Scoring", href: "#speech", description: "Score conversations on a 1–5 scale." },
          { label: "AI Call Summaries", href: "#speech", description: "Capture key insights automatically." },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        title: "By use case",
        links: [
          { label: "Sales", href: "#solutions", description: "Outbound efficiency, connections, conversions.", icon: Zap },
          { label: "Support", href: "#solutions", description: "Inbound routing and real-time insights.", icon: Headphones },
          { label: "Remote", href: "#solutions", description: "Cloud contact center for distributed teams.", icon: Users },
          { label: "AI Contact Center Tools", href: "#products", description: "Dialing to conversation intelligence.", icon: Bot },
        ],
      },
      {
        title: "By industry",
        links: [
          { label: "BPO", href: "#get-started" },
          { label: "Travel & Hospitality", href: "#get-started" },
          { label: "Fintech", href: "#get-started" },
          { label: "Healthcare", href: "#get-started" },
          { label: "eCommerce", href: "#get-started" },
          { label: "iGaming", href: "#get-started" },
          { label: "Telemarketing", href: "#get-started" },
          { label: "All Industries", href: "#get-started" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        title: "Learn",
        links: [
          { label: "Documentation", href: "#get-started", description: "Setup guides and feature docs.", icon: BookOpen },
          { label: "Developers", href: "#get-started", description: "APIs, samples, and Postman collections.", icon: Code2 },
          { label: "Customer Stories", href: "#customers", description: "How teams grow with Relay AI.", icon: Briefcase },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Why Relay AI", href: "#next-level", description: "Beyond dialers — a revenue OS." },
          { label: "Trust & Compliance", href: "#security", description: "Security, GDPR, certifications." },
          { label: "Go Live in 24 Hours", href: "#get-started", description: "Rapid onboarding and CRM setup." },
        ],
      },
    ],
  },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "About",
    columns: [
      {
        title: "About us",
        links: [
          { label: "Who we are", href: "#security", description: "Mission and values.", icon: Building2 },
          { label: "Careers", href: "#get-started", description: "Join the Relay AI team." },
          { label: "Infrastructure", href: "#security", description: "Global coverage and uptime.", icon: Shield },
          { label: "Contact Sales", href: "#get-started", description: "Talk to a solutions specialist." },
        ],
      },
    ],
  },
];

export function RelayHeader() {
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
        <Link to="/" aria-label="Relay AI home" onClick={() => setDesktopOpen(null)}>
          <RelayMark />
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
                    isOpen
                      ? "bg-[#F7FAFF] text-[#0B1B33]"
                      : "text-[#4B5C76] hover:bg-[#F7FAFF] hover:text-[#0B1B33]",
                  )}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setDesktopOpen(isOpen ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown
                    className={cn("size-3.5 opacity-50 transition-transform", isOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>

                <div
                  className={cn(
                    "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition",
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <MegaMenu
                    item={item}
                    onNavigate={() => setDesktopOpen(null)}
                  />
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/app" className="text-sm font-medium text-[#4B5C76] hover:text-[#0B1B33]">
            Log In
          </Link>
          <RelayButton href="#get-started">Try for Free</RelayButton>
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

      {/* Mobile */}
      <div
        className={cn(
          "max-h-[min(80vh,720px)] overflow-y-auto border-t border-[#E8EEF7] bg-white lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-3 py-3">
          {NAV.map((item) => {
            const hasMenu = Boolean(item.columns || item.featured);
            if (!hasMenu) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-[#0B1B33]"
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
                  className="flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-[#0B1B33]"
                  onClick={() => setMobileSection(open ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={cn("size-4 text-[#8A9BB5] transition", open && "rotate-180")} />
                </button>
                {open ? (
                  <div className="space-y-4 border-t border-[#E8EEF7] px-3 py-3">
                    {item.featured ? (
                      <div className="space-y-1">
                        {item.featured.map((link) => (
                          <MobileLink key={link.label} link={link} onClick={() => setMobileOpen(false)} />
                        ))}
                      </div>
                    ) : null}
                    {item.columns?.map((col) => (
                      <div key={col.title}>
                        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A9BB5]">
                          {col.title}
                        </p>
                        <div className="space-y-1">
                          {col.links.map((link) => (
                            <MobileLink key={link.label} link={link} onClick={() => setMobileOpen(false)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <Link
            to="/app"
            className="rounded-xl px-3 py-3 text-sm font-semibold text-[#0B1B33]"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <RelayButton href="#get-started" className="mt-1 w-full">
            Try for Free
          </RelayButton>
        </div>
      </div>
    </header>
  );
}

function MegaMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const isProducts = Boolean(item.featured);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white shadow-[0_24px_80px_-28px_rgba(15,40,80,0.45)]",
        isProducts ? "w-[min(92vw,820px)]" : "w-[min(92vw,560px)]",
      )}
    >
      {item.featured ? (
        <div className="grid gap-0 border-b border-[#E8EEF7] bg-[#F7FAFF] p-3 sm:grid-cols-2 lg:grid-cols-3">
          {item.featured.map((link) => (
            <FeaturedLink key={link.label} link={link} onClick={onNavigate} />
          ))}
        </div>
      ) : null}

      {item.columns ? (
        <div
          className={cn(
            "grid gap-6 p-5",
            item.columns.length > 2 ? "sm:grid-cols-3" : item.columns.length === 2 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A9BB5]">
                {col.title}
              </p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={onNavigate}
                      className="group flex gap-3 rounded-xl px-2 py-2 transition hover:bg-[#F7FAFF]"
                    >
                      {link.icon ? (
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#E8FFF6] text-[#12C48A]">
                          <link.icon className="size-4" />
                        </span>
                      ) : null}
                      <span>
                        <span className="block text-sm font-semibold text-[#0B1B33] group-hover:text-[#12C48A]">
                          {link.label}
                        </span>
                        {link.description ? (
                          <span className="mt-0.5 block text-xs leading-relaxed text-[#8A9BB5]">
                            {link.description}
                          </span>
                        ) : null}
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
        <p className="text-xs text-[#8A9BB5]">Go live with Relay AI in less than 24 hours.</p>
        <a
          href="#get-started"
          onClick={onNavigate}
          className="shrink-0 text-xs font-semibold text-[#12C48A] hover:underline"
        >
          Get Started →
        </a>
      </div>
    </div>
  );
}

function FeaturedLink({ link, onClick }: { link: NavLink; onClick: () => void }) {
  const Icon = link.icon;
  return (
    <a
      href={link.href}
      onClick={onClick}
      className="group flex gap-3 rounded-xl border border-transparent bg-white p-3 shadow-sm transition hover:border-[#2EE6A6]/40 hover:shadow-md"
    >
      {Icon ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#E8FFF6] to-[#D9F7FF] text-[#12C48A]">
          <Icon className="size-4" />
        </span>
      ) : null}
      <span>
        <span className="block text-sm font-semibold text-[#0B1B33] group-hover:text-[#12C48A]">
          {link.label}
        </span>
        {link.description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-[#8A9BB5]">{link.description}</span>
        ) : null}
      </span>
    </a>
  );
}

function MobileLink({ link, onClick }: { link: NavLink; onClick: () => void }) {
  return (
    <a
      href={link.href}
      onClick={onClick}
      className="block rounded-lg px-2 py-2 text-sm font-medium text-[#4B5C76] hover:bg-[#F7FAFF] hover:text-[#0B1B33]"
    >
      {link.label}
      {link.description ? (
        <span className="mt-0.5 block text-xs font-normal text-[#8A9BB5]">{link.description}</span>
      ) : null}
    </a>
  );
}
