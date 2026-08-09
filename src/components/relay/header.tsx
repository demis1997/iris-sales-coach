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
  Headphones,
  Menu,
  PhoneCall,
  Radio,
  Shield,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { ArtemisButton, ArtemisMark } from "@/components/relay/brand";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type NavColumn = { title: string; links: NavLink[] };

type NavItem =
  | { label: string; href: string; columns?: never; featured?: never }
  | { label: string; href?: string; columns: NavColumn[]; featured?: NavLink[] };

const NAV: NavItem[] = [
  {
    label: "Product",
    featured: [
      {
        label: "Artemis Copilot",
        href: "/artemis-copilot",
        description: "Live guidance during every conversation.",
        icon: Radio,
      },
      {
        label: "Revenue Intelligence",
        href: "/revenue-intelligence",
        description: "Know why revenue is moving.",
        icon: BarChart3,
      },
      {
        label: "Manager Operations",
        href: "/manager-operations",
        description: "Run the floor without listening to every call.",
        icon: Users,
      },
      {
        label: "Executive Command Center",
        href: "/executive-command-center",
        description: "See what drives revenue.",
        icon: Gauge,
      },
    ],
    columns: [
      {
        title: "Intelligence",
        links: [
          {
            label: "Conversation Intelligence",
            href: "/conversation-intelligence",
            description: "The layer underneath Artemis.",
            icon: Brain,
          },
          {
            label: "Revenue Intelligence",
            href: "/revenue-intelligence",
            description: "Know why revenue is moving.",
            icon: BarChart3,
          },
          {
            label: "Call Intelligence",
            href: "/call-intelligence",
            description: "Every call as structured intelligence.",
            icon: PhoneCall,
          },
        ],
      },
      {
        title: "Coaching",
        links: [
          {
            label: "Artemis Copilot",
            href: "/artemis-copilot",
            description: "Live guidance during every conversation.",
            icon: Radio,
          },
          {
            label: "AI Coaching",
            href: "/ai-coaching",
            description: "Personal coaching after every call.",
            icon: Sparkles,
          },
          {
            label: "Rep DNA",
            href: "/rep-dna",
            description: "How every rep sells.",
            icon: Dna,
          },
          {
            label: "AI Roleplay",
            href: "/ai-roleplay",
            description: "Practice before customers.",
            icon: Bot,
          },
        ],
      },
      {
        title: "Management",
        links: [
          {
            label: "Manager Operations",
            href: "/manager-operations",
            description: "Run the floor without listening to every call.",
            icon: Users,
          },
          {
            label: "Executive Command Center",
            href: "/executive-command-center",
            description: "See what drives revenue.",
            icon: Gauge,
          },
          {
            label: "Adaptive Playbooks",
            href: "/adaptive-playbooks",
            description: "Turn winning calls into guidance.",
            icon: BookOpen,
          },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        title: "By role",
        links: [
          { label: "Sales Agents", href: "/solutions/sales", description: "Live copilot and personal improvement." },
          { label: "Managers", href: "/solutions/sales-management", description: "Attention queues and coaching." },
          { label: "Revenue Leaders", href: "/solutions/revenue-leaders", description: "Conversation-driven revenue views." },
        ],
      },
      {
        title: "By function",
        links: [
          { label: "Quality Assurance", href: "/solutions/quality-assurance" },
          { label: "Training", href: "/solutions/training" },
          { label: "Compliance", href: "/solutions/compliance" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    columns: [
      {
        title: "Beachhead",
        links: [
          {
            label: "Forex & CFD",
            href: "/industries/forex",
            description: "FTDs, desks, trust objections.",
            icon: Target,
          },
        ],
      },
      {
        title: "Also built for",
        links: [
          { label: "Financial Services", href: "/industries/financial-services" },
          { label: "Insurance", href: "/industries/insurance" },
          { label: "Real Estate", href: "/industries/real-estate" },
          { label: "BPO & Contact Centers", href: "/industries/bpo" },
          { label: "SaaS Sales", href: "/industries/saas" },
          { label: "Recruiting", href: "/industries/recruiting" },
          { label: "Telemarketing", href: "/industries/telemarketing" },
          { label: "All industries", href: "/industries" },
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
          { label: "Guides", href: "/resources", description: "Practical writing on high-volume sales." },
          { label: "Documentation", href: "/docs", description: "Product docs preview." },
          { label: "Integrations", href: "/integrations", description: "CRM, telephony, and APIs." },
        ],
      },
      {
        title: "Explore",
        links: [
          {
            label: "Product Demo",
            href: "/demo",
            description: "CEO, manager, and agent views.",
            icon: Headphones,
          },
          { label: "Pricing", href: "/pricing" },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        title: "Artemis",
        links: [
          { label: "About", href: "/company", description: "What we're building and why.", icon: Building2 },
          { label: "Security", href: "/security", description: "Architecture and roadmap.", icon: Shield },
          { label: "Contact", href: "/contact", description: "Talk to us." },
        ],
      },
    ],
  },
];

function NavHref({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href as "/"} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

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
                <NavHref
                  key={item.label}
                  href={item.href!}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5C76] transition-colors hover:bg-[#F7FAFF] hover:text-[#0B1B33]"
                  onClick={() => setDesktopOpen(null)}
                >
                  {item.label}
                </NavHref>
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
            Explore Demo
          </Link>
          <ArtemisButton href="/contact">Book a Demo</ArtemisButton>
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

      <div className={cn("border-t border-[#E8EEF7] bg-white lg:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="mx-auto max-w-6xl space-y-1 px-5 py-4">
          {NAV.map((item) => {
            const hasMenu = Boolean(item.columns || item.featured);
            if (!hasMenu) {
              return (
                <NavHref
                  key={item.label}
                  href={item.href!}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0B1B33]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavHref>
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
                      <NavHref
                        key={link.label}
                        href={link.href}
                        className="block"
                        onClick={() => setMobileOpen(false)}
                      >
                        <p className="text-sm font-semibold text-[#0B1B33]">{link.label}</p>
                        {link.description ? (
                          <p className="mt-0.5 text-xs text-[#8A9BB5]">{link.description}</p>
                        ) : null}
                      </NavHref>
                    ))}
                    {item.columns?.map((col) => (
                      <div key={col.title}>
                        <p className="mb-2 text-[11px] font-semibold tracking-wide text-[#8A9BB5] uppercase">
                          {col.title}
                        </p>
                        <div className="space-y-2">
                          {col.links.map((link) => (
                            <NavHref
                              key={link.label}
                              href={link.href}
                              className="block text-sm text-[#4B5C76]"
                              onClick={() => setMobileOpen(false)}
                            >
                              {link.label}
                            </NavHref>
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
              Explore Demo
            </Link>
            <Link
              to="/contact"
              className="flex-1 rounded-full bg-[#2EE6A6] px-4 py-2.5 text-center text-sm font-semibold text-[#0B1B33]"
              onClick={() => setMobileOpen(false)}
            >
              Book a Demo
            </Link>
          </div>
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
    <div className="w-[min(92vw,880px)] overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white shadow-[0_30px_80px_-28px_rgba(15,40,80,0.45)]">
      {item.featured ? (
        <div className="grid gap-2 border-b border-[#E8EEF7] bg-[#F7FAFF] p-4 sm:grid-cols-2">
          {item.featured.map((link) => (
            <NavHref
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
            </NavHref>
          ))}
        </div>
      ) : null}
      {item.columns ? (
        <div
          className={cn(
            "grid gap-6 p-5",
            item.columns.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold tracking-wide text-[#8A9BB5] uppercase">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <NavHref
                      href={link.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-2 py-1.5 transition hover:bg-[#F7FAFF]"
                    >
                      <span className="block text-sm font-medium text-[#0B1B33]">{link.label}</span>
                      {link.description ? (
                        <span className="mt-0.5 block text-xs text-[#8A9BB5]">{link.description}</span>
                      ) : null}
                    </NavHref>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 border-t border-[#E8EEF7] bg-[#F7FAFF] px-5 py-3">
        <p className="text-xs text-[#8A9BB5]">The AI Operating System for revenue teams.</p>
        <NavHref href="/contact" onClick={onNavigate} className="shrink-0 text-xs font-semibold text-[#12C48A] hover:underline">
          Book a Demo →
        </NavHref>
      </div>
    </div>
  );
}
