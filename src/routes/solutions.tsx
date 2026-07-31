import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/page-shell";
import { ContentCard, Reveal, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/solutions")({
  head: () =>
    pageHead({
      title: "Solutions — Iris for Reps, Managers & Executives",
      description:
        "See how Iris serves sales representatives, managers, and executives with coaching, visibility, and revenue intelligence.",
      path: "/solutions",
    }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const roles = [
    {
      title: "Sales representatives",
      text: "A private AI coach, clearer next steps, and less CRM admin.",
      to: "/solutions/sales-representatives" as const,
    },
    {
      title: "Sales managers",
      text: "Coach the right person on the right skill with evidence from every call.",
      to: "/solutions/sales-managers" as const,
    },
    {
      title: "Executives",
      text: "Understand what is driving—or threatening—revenue across teams.",
      to: "/solutions/executives" as const,
    },
  ];

  return (
    <MarketingPage
      eyebrow="Solutions"
      title="Role-specific value from the same conversations"
      lede="Iris does not give every user the same dashboard. Representatives improve privately. Managers prioritise coaching. Executives see organisational risk and performance."
    >
      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role, i) => (
            <Reveal key={role.title} delay={i * 0.05}>
              <Link to={role.to} className="block h-full">
                <ContentCard className="h-full transition-colors hover:border-primary/40">
                  <h2 className="text-lg font-semibold">{role.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{role.text}</p>
                  <span className="mt-5 inline-block text-sm font-medium text-primary">
                    Explore →
                  </span>
                </ContentCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </MarketingPage>
  );
}
