import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { ArtemisMark } from "@/components/artemis/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const solutions = [
  { label: "Sales representatives", to: "/solutions/sales-representatives" as const },
  { label: "Sales managers", to: "/solutions/sales-managers" as const },
  { label: "Executives", to: "/solutions/executives" as const },
];

const industries = [
  { label: "Forex & brokerages", to: "/industries/forex" as const },
  { label: "Call centres", to: "/industries/call-centres" as const },
  { label: "Financial services", to: "/industries/financial-services" as const },
  { label: "Real estate", to: "/industries/real-estate" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link to="/" className="shrink-0" aria-label="Artemis home">
          <ArtemisMark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <NavLink to="/product">Product</NavLink>
          <Dropdown
            label="Solutions"
            open={solutionsOpen}
            onOpenChange={setSolutionsOpen}
            items={solutions}
          />
          <Dropdown
            label="Industries"
            open={industriesOpen}
            onOpenChange={setIndustriesOpen}
            items={industries}
          />
          <NavLink to="/integrations">Integrations</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/security">Security</NavLink>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/login"
              onClick={() => track("login_clicked", { source: "header" })}
            >
              Log in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link
              to="/book-demo"
              onClick={() => track("book_demo_cta_clicked", { source: "header" })}
            >
              Book a demo
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            <MobileLink to="/product" onNavigate={() => setOpen(false)}>
              Product
            </MobileLink>
            <p className="px-3 pt-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Solutions
            </p>
            {solutions.map((s) => (
              <MobileLink key={s.to} to={s.to} onNavigate={() => setOpen(false)}>
                {s.label}
              </MobileLink>
            ))}
            <p className="px-3 pt-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Industries
            </p>
            {industries.map((s) => (
              <MobileLink key={s.to} to={s.to} onNavigate={() => setOpen(false)}>
                {s.label}
              </MobileLink>
            ))}
            <MobileLink to="/integrations" onNavigate={() => setOpen(false)}>
              Integrations
            </MobileLink>
            <MobileLink to="/pricing" onNavigate={() => setOpen(false)}>
              Pricing
            </MobileLink>
            <MobileLink to="/security" onNavigate={() => setOpen(false)}>
              Security
            </MobileLink>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link to="/book-demo" onClick={() => setOpen(false)}>
                  Book a demo
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  to,
  children,
}: {
  to: "/product" | "/integrations" | "/pricing" | "/security";
  children: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function Dropdown({
  label,
  open,
  onOpenChange,
  items,
}: {
  label: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: { label: string; to: string }[];
}) {
  return (
    <div
      className="relative"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute top-full left-0 z-50 min-w-[220px] pt-1">
          <div className="rounded-lg border border-border bg-popover p-1.5 shadow-lg">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => onOpenChange(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileLink({
  to,
  children,
  onNavigate,
}: {
  to: string;
  children: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}
