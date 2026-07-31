import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-secondary/40">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-xs text-muted-foreground sm:text-[13px]">
        <span>
          Introducing Artemis Intelligence — turn every sales conversation into coaching, forecasting,
          and revenue insight.
        </span>
        <Link
          to="/product"
          className="font-medium text-primary hover:underline"
          onClick={() => track("explore_platform_clicked", { source: "announcement" })}
        >
          Explore the platform →
        </Link>
      </div>
    </div>
  );
}
