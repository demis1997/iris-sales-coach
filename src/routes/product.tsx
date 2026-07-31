import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage, CardGrid } from "@/components/marketing/page-shell";
import { ContentCard, Reveal, Section } from "@/components/marketing/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/product")({
  head: () =>
    pageHead({
      title: "Product — Iris Sales Operating System",
      description:
        "Explore Iris capabilities: AI coaching, manager intelligence, pipeline risk, playbooks, training, CRM automation, and executive visibility.",
      path: "/product",
    }),
  component: ProductPage,
});

function ProductPage() {
  return (
    <MarketingPage
      eyebrow="Product"
      title="The AI operating system for high-performance sales teams"
      lede="Iris turns every sales conversation into coaching, playbooks, CRM hygiene, and revenue intelligence—so performance compounds across the organisation."
    >
      <Section
        title="Capability overview"
        lede="Each module feeds the others. Analysis without coaching, or coaching without pipeline context, is only half the system."
      >
        <CardGrid
          items={[
            {
              title: "AI Sales Coach",
              text: "Specific, timestamped guidance for every representative after every call.",
            },
            {
              title: "Manager Intelligence",
              text: "Coaching queues ranked by impact—not whoever happens to be reviewed next.",
            },
            {
              title: "Pipeline Intelligence",
              text: "Deal risk grounded in buyer language, objections, and next-step discipline.",
            },
            {
              title: "AI Playbooks",
              text: "Capture top-performer behaviour and measure adoption across desks.",
            },
            {
              title: "Training & roleplay",
              text: "Practise the exact objections and scenarios each person struggles with.",
            },
            {
              title: "CRM automation",
              text: "Summaries, tasks, and stage suggestions without extra admin time.",
            },
            {
              title: "Executive intelligence",
              text: "Revenue influenced, forecast confidence, and coaching ROI in one view.",
            },
            {
              title: "Knowledge base",
              text: "Search conversations, moments, competitors, and best responses.",
            },
          ]}
        />
      </Section>

      <Section title="See the product in context">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Representatives",
              text: "Private coaching, preparation, and progress.",
              to: "/solutions/sales-representatives" as const,
            },
            {
              title: "Managers",
              text: "Priorities, skill gaps, and fair comparisons.",
              to: "/solutions/sales-managers" as const,
            },
            {
              title: "Executives",
              text: "Pipeline risk and conversion drivers.",
              to: "/solutions/executives" as const,
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <ContentCard className="h-full">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                <Link to={item.to} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                  Explore →
                </Link>
              </ContentCard>
            </Reveal>
          ))}
        </div>
      </Section>
    </MarketingPage>
  );
}
