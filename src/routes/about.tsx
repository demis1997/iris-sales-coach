import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About — Artemis",
      description:
        "Artemis is building the AI operating system for high-performance sales teams—coaching, pipeline intelligence, and organisational learning from every conversation.",
      path: "/about",
    }),
  component: () => (
    <PlaceholderPage
      title="About Artemis"
      description="We are building the AI operating system for high-performance sales teams."
      body="Artemis exists because managers cannot listen to every call—and organisations cannot afford for winning behaviours to stay trapped with a few top performers. We turn every sales conversation into coaching, playbooks, CRM hygiene, and revenue visibility. This page will expand with company story and team details."
    />
  ),
});
