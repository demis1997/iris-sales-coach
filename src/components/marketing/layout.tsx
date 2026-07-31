import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { AnnouncementBar } from "./announcement-bar";

export function MarketingLayout({
  children,
  showAnnouncement = false,
}: {
  children: ReactNode;
  showAnnouncement?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      {showAnnouncement ? <AnnouncementBar /> : null}
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
