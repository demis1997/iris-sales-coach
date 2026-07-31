import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageHead({
      title: "Cookie Policy — Artemis",
      description: "Artemis cookie policy placeholder describing how cookies may be used on this site.",
      path: "/cookies",
    }),
  component: () => (
    <PlaceholderPage
      title="Cookie policy"
      description="How this website may use cookies and similar technologies."
      body="Essential cookies may be required for site functionality. Analytics cookies will only be introduced when a provider is configured and consent mechanisms are in place. This page will be updated with a full cookie table before production analytics go live."
    />
  ),
});
