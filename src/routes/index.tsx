import { createFileRoute } from "@tanstack/react-router";
import { ArtemisHomePage } from "@/components/relay/home-page";

const title = "Artemis AI — The AI Operating System for Revenue Teams";
const description =
  "Artemis is building the AI operating system for high-volume revenue teams — conversation intelligence, coaching, and executive visibility. Explore the interactive product demo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: ArtemisHomePage,
});
