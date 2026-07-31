import { createFileRoute, Link } from "@tanstack/react-router";
import { IrisMark } from "@/components/iris/app-shell";
import { Hero } from "@/components/landing/hero";
import { Plateau, Problem, Solution } from "@/components/landing/problem-solution";
import { Benefits, Capabilities, Comparison } from "@/components/landing/benefits";
import { InteractiveDemo } from "@/components/landing/interactive-demo";
import { ProductTour, SimpleExplainer } from "@/components/landing/product-tour";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { Integrations, Security, Testimonials } from "@/components/landing/proof";
import { Faq, FinalCta, Footer, Pricing } from "@/components/landing/pricing-faq";

const title = "Iris — Revenue Acceleration Platform for Sales Teams";
const description =
  "Iris analyzes every sales call, shows why deals are lost, coaches each rep automatically and gives managers full visibility. Increase close rates, cut coaching cost, stay compliant.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Iris",
          applicationCategory: "BusinessApplication",
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }),
      },
    ],
  }),
  component: Landing,
});

const nav = [
  ["Platform", "#platform"],
  ["See it", "#tour"],
  ["Results", "#results"],
  ["ROI", "#roi"],
  ["Security", "#security"],
  ["Pricing", "#pricing"],
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <IrisMark />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {nav.map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <a
              href="#demo-form"
              className="rounded-lg gradient-surface px-3.5 py-1.5 text-sm font-semibold text-background"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>

      <main>
        <Hero />

        <SimpleExplainer />
        <Plateau />
        <Problem />
        <Solution />
        <ProductTour />
        <Benefits />
        <InteractiveDemo />
        <RoiCalculator />
        <Testimonials />
        <Security />
        <Integrations />
        <Capabilities />
        <Comparison />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
