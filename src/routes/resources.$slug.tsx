import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MarketingCTA,
  MarketingSection,
  MarketingShell,
  seoMeta,
} from "@/components/marketing/shell";
import { ARTICLES, getArticle } from "@/data/marketing/resources";

export const Route = createFileRoute("/resources/$slug")({
  head: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) return {};
    return seoMeta({
      title: `${article.title} | Artemis AI`,
      description: article.description,
      path: `/resources/${article.slug}`,
    });
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug);
  if (!article) throw notFound();
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <MarketingShell>
      <article className="border-b border-[#E8EEF7]">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9BB5]">
            {article.category} · {article.date} · {article.readingTime}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0B1B33]">{article.title}</h1>
          <p className="mt-4 text-lg text-[#4B5C76]">{article.description}</p>
          <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-[#4B5C76]">
            {article.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </article>
      <MarketingSection eyebrow="Related" title="Keep reading" tone="soft">
        <div className="grid gap-4 md:grid-cols-2">
          {related.map((a) => (
            <Link
              key={a.slug}
              to="/resources/$slug"
              params={{ slug: a.slug }}
              className="rounded-2xl border border-[#E8EEF7] bg-white p-5"
            >
              <p className="font-semibold text-[#0B1B33]">{a.title}</p>
              <p className="mt-2 text-sm text-[#4B5C76]">{a.description}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>
      <MarketingCTA
        title="See the product, not just the writing."
        subtitle="Explore the interactive demo or book time with us."
        primary={{ label: "Explore Demo", href: "/demo" }}
        secondary={{ label: "Book a Demo", href: "/contact" }}
      />
    </MarketingShell>
  );
}
