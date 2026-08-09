import { createFileRoute, notFound } from "@tanstack/react-router";
import { IndustryMarketingPage } from "@/components/marketing/role-pages";
import { seoMeta } from "@/components/marketing/shell";
import { getIndustry } from "@/data/marketing/industries";

export const Route = createFileRoute("/industries/$slug")({
  head: ({ params }) => {
    const industry = getIndustry(params.slug);
    if (!industry) return {};
    return seoMeta({
      title: industry.seoTitle,
      description: industry.seoDescription,
      path: industry.path,
    });
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const industry = getIndustry(slug);
  if (!industry) throw notFound();
  return <IndustryMarketingPage industry={industry} />;
}
