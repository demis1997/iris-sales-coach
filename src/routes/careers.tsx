import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/marketing/page-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers")({
  head: () =>
    pageHead({
      title: "Careers — Iris",
      description: "Careers at Iris. Open roles will be listed here as the team grows.",
      path: "/careers",
    }),
  component: () => (
    <PlaceholderPage
      title="Careers"
      description="Help build the sales operating system for high-performance teams."
      body="We are not publishing open roles on this site yet. If you are interested in product, engineering, design, or go-to-market roles, email careers@iris.sales with a short note and links to your work. This page will list openings when hiring is active."
    />
  ),
});
