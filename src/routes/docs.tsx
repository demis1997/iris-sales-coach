import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MarketingHero,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";

export const Route = createFileRoute("/docs")({
  head: () =>
    seoMeta({
      title: "Documentation Preview | Artemis AI",
      description:
        "Lightweight product documentation preview for Artemis — getting started, calls, teams, scorecards, integrations, and APIs.",
      path: "/docs",
    }),
  component: DocsPage,
});

const SECTIONS = [
  {
    title: "Getting Started",
    status: "Preview",
    items: ["Create a workspace", "Invite teammates", "Upload or connect calls", "Explore role views"],
  },
  {
    title: "Calls",
    status: "Preview",
    items: ["Call records", "Transcripts", "Scores", "Next best actions"],
  },
  {
    title: "Users & Teams",
    status: "Preview",
    items: ["Roles", "Desks", "Membership", "Permissions"],
  },
  {
    title: "Scorecards",
    status: "Preview",
    items: ["Dimensions", "Evidence", "Calibration notes"],
  },
  {
    title: "Integrations",
    status: "Preview",
    items: ["CRM connectors", "Telephony", "Webhooks"],
  },
  {
    title: "API & Webhooks",
    status: "Preview",
    items: [
      "API direction (not production-ready)",
      "Event types (planned)",
      "Authentication (planned)",
    ],
  },
];

function DocsPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Documentation"
        title="Product docs preview."
        subtitle="These sections describe the product direction. API and webhook references are labeled Preview — not production-ready endpoints."
        actions={
          <Link
            to="/demo"
            className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30"
          >
            Explore Demo
          </Link>
        }
      />
      <MarketingSection tone="white">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <article key={s.title} className="rounded-[1.5rem] border border-[#E8EEF7] p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-[#0B1B33]">{s.title}</h2>
                <span className="rounded-full bg-[#FFF4E8] px-2 py-0.5 text-[11px] font-medium text-[#C97A2D]">
                  {s.status}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#4B5C76]">
                {s.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-[#8A9BB5]">
          Need implementation details for a design partnership?{" "}
          <Link to="/contact" className="font-semibold text-[#12C48A] hover:underline">
            Contact us
          </Link>
          .
        </p>
      </MarketingSection>
    </MarketingShell>
  );
}
