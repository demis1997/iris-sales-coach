import { createFileRoute } from "@tanstack/react-router";
import { CallDetailPage } from "@/components/app/call-detail";

export const Route = createFileRoute("/app/calls/$callId")({
  head: ({ params }) => ({
    meta: [
      { title: `Call ${params.callId} — Iris` },
      { name: "description", content: "Recording, transcript, AI analysis, and deal intelligence." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: function CallRoute() {
    const { callId } = Route.useParams();
    return <CallDetailPage callId={callId} />;
  },
});
