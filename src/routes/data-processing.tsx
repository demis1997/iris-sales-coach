import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/data-processing")({
  head: () =>
    pageHead({
      title: "Data Processing — Artemis",
      description:
        "Artemis data processing addendum placeholder for enterprise customers evaluating the platform.",
      path: "/data-processing",
    }),
  component: () => (
    <PlaceholderPage
      title="Data processing"
      description="Information for customers evaluating Artemis as a processor of conversation data."
      body="A formal Data Processing Addendum (DPA) will be provided to enterprise customers. Until then, see /security for architecture, AI data-use principles, and how to request a security questionnaire. Subprocessors will be listed for production environments."
    />
  ),
});
