import { createFileRoute } from "@tanstack/react-router";
import { RelayHomePage } from "@/components/relay/home-page";

const title = "Relay AI — AI Contact Center Software";
const description =
  "Unify every customer interaction with an AI-powered contact center. Omnichannel, predictive dialer, speech analytics, flow builder — and a revenue OS that coaches reps in real time.";

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
  component: RelayHomePage,
});
