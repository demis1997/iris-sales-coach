import { createFileRoute, notFound } from "@tanstack/react-router";
import { SolutionMarketingPage } from "@/components/marketing/role-pages";
import { seoMeta } from "@/components/marketing/shell";
import { getSolution } from "@/data/marketing/solutions";

export const Route = createFileRoute("/solutions/$slug")({
  head: ({ params }) => {
    const solution = getSolution(params.slug);
    if (!solution) return {};
    return seoMeta({
      title: solution.seoTitle,
      description: solution.seoDescription,
      path: solution.path,
    });
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const solution = getSolution(slug);
  if (!solution) throw notFound();
  return <SolutionMarketingPage solution={solution} />;
}
