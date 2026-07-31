import { Link } from "@tanstack/react-router";
import { IrisMark } from "@/components/iris/app-shell";

const columns = [
  {
    title: "Product",
    links: [
      { label: "AI Coach", to: "/product" },
      { label: "Manager Intelligence", to: "/product" },
      { label: "Pipeline Intelligence", to: "/product" },
      { label: "Playbooks", to: "/product" },
      { label: "Training", to: "/product" },
      { label: "Integrations", to: "/integrations" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Representatives", to: "/solutions/sales-representatives" },
      { label: "Managers", to: "/solutions/sales-managers" },
      { label: "Executives", to: "/solutions/executives" },
      { label: "Forex", to: "/industries/forex" },
      { label: "Call centres", to: "/industries/call-centres" },
      { label: "Financial services", to: "/industries/financial-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/careers" },
      { label: "Security", to: "/security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Cookie policy", to: "/cookies" },
      { label: "Data processing", to: "/data-processing" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/15">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <IrisMark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI operating system for high-performance sales teams. Every conversation makes
              your entire team smarter.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-[0.12em] text-foreground uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Iris. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link to="/app" className="hover:text-foreground">
              Product demo
            </Link>
            <Link to="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link to="/book-demo" className="hover:text-foreground">
              Book a demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
