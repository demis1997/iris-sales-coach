import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy Policy — Artemis",
      description: "Artemis privacy policy placeholder. Full policy will be published for production customers.",
      path: "/privacy",
    }),
  component: () => (
    <PlaceholderPage
      title="Privacy policy"
      description="How Artemis handles personal data."
      body="This is a placeholder privacy notice for the evaluation site. A full privacy policy—covering controllers/processors, lawful bases, retention, international transfers, and individual rights—will be published before general availability. For current questions, contact privacy@artemis.sales or see /security for related controls."
    />
  ),
});
