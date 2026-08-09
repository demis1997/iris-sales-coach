import { Link } from "@tanstack/react-router";
import { ArtemisMark } from "@/components/relay/brand";
import { ContactLinks } from "@/components/relay/contact-links";
import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_PHONE_DISPLAY, CONTACT_TEL } from "@/components/relay/contact";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Artemis Copilot", href: "/artemis-copilot" },
      { label: "Conversation Intelligence", href: "/conversation-intelligence" },
      { label: "Revenue Intelligence", href: "/revenue-intelligence" },
      { label: "Rep DNA", href: "/rep-dna" },
      { label: "AI Coaching", href: "/ai-coaching" },
      { label: "AI Roleplay", href: "/ai-roleplay" },
      { label: "Manager Operations", href: "/manager-operations" },
      { label: "Executive Command Center", href: "/executive-command-center" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Sales", href: "/solutions/sales" },
      { label: "Sales Management", href: "/solutions/sales-management" },
      { label: "Revenue Leaders", href: "/solutions/revenue-leaders" },
      { label: "Quality Assurance", href: "/solutions/quality-assurance" },
      { label: "Compliance", href: "/solutions/compliance" },
      { label: "Training", href: "/solutions/training" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Forex & CFD", href: "/industries/forex" },
      { label: "Insurance", href: "/industries/insurance" },
      { label: "Financial Services", href: "/industries/financial-services" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "BPO & Contact Centers", href: "/industries/bpo" },
      { label: "SaaS Sales", href: "/industries/saas" },
      { label: "Recruiting", href: "/industries/recruiting" },
      { label: "Telemarketing", href: "/industries/telemarketing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Product Demo", href: "/demo" },
      { label: "Guides", href: "/resources" },
      { label: "Documentation", href: "/docs" },
      { label: "Integrations", href: "/integrations" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function ArtemisFooter() {
  return (
    <footer className="border-t border-[#E8EEF7] bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 lg:flex-row lg:justify-between">
        <div className="max-w-xs">
          <ArtemisMark />
          <p className="mt-3 text-sm leading-relaxed text-[#8A9BB5]">
            The AI operating system for high-volume sales organizations.
          </p>
          <ContactLinks className="mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-semibold text-[#0B1B33]">{col.title}</p>
              <ul className="mt-3 space-y-2 text-[#8A9BB5]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("mailto:") || l.href.startsWith("tel:") ? (
                      <a href={l.href} className="hover:text-[#12C48A]">
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.href as "/"} className="hover:text-[#12C48A]">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-xs text-[#A8B5C9]">
        <p>
          © {new Date().getFullYear()} Artemis AI. All rights reserved. ·{" "}
          <a href={CONTACT_MAILTO} className="hover:text-[#12C48A]">
            {CONTACT_EMAIL}
          </a>{" "}
          ·{" "}
          <a href={CONTACT_TEL} className="hover:text-[#12C48A]">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </p>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-[#12C48A]">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-[#12C48A]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
