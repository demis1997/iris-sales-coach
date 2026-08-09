import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductMarketingPage } from "@/components/marketing/product-page";
import { seoMeta } from "@/components/marketing/shell";
import { getProduct } from "@/data/marketing/products";

const product = getProduct("artemis-copilot");

export const Route = createFileRoute("/artemis-copilot")({
  head: () => {
    if (!product) return {};
    return seoMeta({
      title: product.seoTitle,
      description: product.seoDescription,
      path: product.path,
    });
  },
  component: Page,
});

function Page() {
  if (!product) throw notFound();
  return <ProductMarketingPage product={product} />;
}
