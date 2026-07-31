import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms of Service — Iris",
      description: "Iris terms of service placeholder for the evaluation website.",
      path: "/terms",
    }),
  component: () => (
    <PlaceholderPage
      title="Terms of service"
      description="Terms governing use of the Iris website and product."
      body="These terms are a placeholder for the marketing and demo experience. Production customer terms, SLAs, and order forms will be provided during commercial onboarding. Demo workspaces are provided as-is for evaluation."
    />
  ),
});
