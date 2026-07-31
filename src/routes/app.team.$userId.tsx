import { createFileRoute } from "@tanstack/react-router";
import { RepProfilePage } from "@/components/app/rep-profile";

export const Route = createFileRoute("/app/team/$userId")({
  head: ({ params }) => ({
    meta: [{ title: `Profile ${params.userId} — Artemis` }, { name: "robots", content: "noindex" }],
  }),
  component: function ProfileRoute() {
    const { userId } = Route.useParams();
    return <RepProfilePage userId={userId} />;
  },
});
