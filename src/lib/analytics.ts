/**
 * Lightweight analytics abstraction.
 * Wire PostHog / Plausible / Segment here later — no third-party SDK yet.
 */

export type AnalyticsEvent =
  | "hero_demo_cta_clicked"
  | "book_demo_cta_clicked"
  | "pricing_viewed"
  | "demo_form_started"
  | "demo_form_submitted"
  | "integration_clicked"
  | "security_page_viewed"
  | "login_clicked"
  | "explore_platform_clicked"
  | "onboarding_started"
  | "onboarding_completed"
  | "first_call_analysed"
  | "knowledge_search"
  | "report_exported";

type Props = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined") return;

  const payload = { event, ...props, ts: Date.now() };

  // Future: window.posthog?.capture(event, props)
  // Future: window.plausible?.(event, { props })
  if (import.meta.env.DEV) {
    console.debug("[analytics]", payload);
  }

  window.dispatchEvent(new CustomEvent("iris:analytics", { detail: payload }));
}
