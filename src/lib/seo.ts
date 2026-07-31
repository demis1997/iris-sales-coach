export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

const SITE = "https://iris.sales";

export function pageHead({ title, description, path, ogImage }: PageSeo) {
  const url = `${SITE}${path === "/" ? "" : path}`;
  const image = ogImage ?? `${SITE}/og.png`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}

export function softwareApplicationJsonLd(description: string) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Iris",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        availability: "https://schema.org/OnlineOnly",
      },
    }),
  };
}
