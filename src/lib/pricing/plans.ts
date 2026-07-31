/**
 * Configurable commercial plans — keep business rules out of page components.
 */

export type PricingPlanId = "starter" | "growth" | "enterprise";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  priceLabel: string;
  period: string;
  description: string;
  featured: boolean;
  features: string[];
  cta: string;
  maxUsers: number | null;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "€299",
    period: "/month",
    description: "For small sales teams building a consistent coaching process.",
    featured: false,
    cta: "Book a demo",
    maxUsers: 5,
    features: [
      "Up to 5 users",
      "Monthly call-analysis allowance",
      "AI call summaries",
      "Individual coaching",
      "Basic scorecards",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    priceLabel: "€999",
    period: "/month",
    description: "For teams that need management intelligence and revenue visibility.",
    featured: true,
    cta: "Book a demo",
    maxUsers: 25,
    features: [
      "Up to 25 users",
      "Larger analysis allowance",
      "Manager dashboards",
      "Pipeline intelligence",
      "CRM integrations",
      "Team playbooks",
      "Training assignments",
      "Advanced reporting",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceLabel: "Custom",
    period: "",
    description: "For regulated and high-volume sales organisations.",
    featured: false,
    cta: "Talk to sales",
    maxUsers: null,
    features: [
      "Custom users and usage",
      "Multiple teams and offices",
      "SSO and advanced permissions",
      "Custom retention",
      "API and webhooks",
      "Custom scorecards",
      "Dedicated onboarding",
      "Security review",
      "Private deployment options where supported",
      "Dedicated customer success",
    ],
  },
];

export const PRICING_FAQS: { question: string; answer: string }[] = [
  {
    question: "How is usage calculated?",
    answer:
      "Plans include a monthly analysis allowance based on analysed minutes and seats. Exact allowances are confirmed during demo based on your call volume.",
  },
  {
    question: "Can Iris analyse existing recordings?",
    answer:
      "Yes. During onboarding you can upload historical recordings or connect a call source so Iris can establish a baseline before live coaching starts.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "Language coverage expands over time. Confirm your primary languages in the demo so we can validate fit for your desks.",
  },
  {
    question: "Does Iris integrate with our CRM?",
    answer:
      "CRM connectors are rolling out with clear Available / In development / Planned statuses on the integrations page. We scope your stack in the demo.",
  },
  {
    question: "Can we customise the scorecard?",
    answer:
      "Yes. Managers and admins define required stages, terminology, products, competitors, and playbook rules.",
  },
  {
    question: "How does Iris protect call data?",
    answer:
      "See the Security page for current controls and roadmap items. We do not claim certifications we have not achieved.",
  },
  {
    question: "Can we use Iris across multiple teams?",
    answer:
      "Growth and Enterprise support multiple teams. Enterprise adds offices, advanced permissions, and regional controls.",
  },
  {
    question: "Does Iris support regulated industries?",
    answer:
      "Iris can support monitoring of scripts and disclosures you define. It does not replace your compliance programme or guarantee regulatory outcomes.",
  },
];

export type UsageEstimateInput = {
  representatives: number;
  monthlyCallsPerRep: number;
  averageCallMinutes: number;
};

export function estimateMonthlyMinutes(input: UsageEstimateInput) {
  return input.representatives * input.monthlyCallsPerRep * input.averageCallMinutes;
}

export function recommendPlan(input: UsageEstimateInput): {
  planId: PricingPlanId;
  guidance: string;
  monthlyMinutes: number;
} {
  const monthlyMinutes = estimateMonthlyMinutes(input);
  if (input.representatives <= 5 && monthlyMinutes < 4000) {
    return {
      planId: "starter",
      monthlyMinutes,
      guidance: "Starter is typically a fit to evaluate.",
    };
  }
  if (input.representatives <= 25) {
    return {
      planId: "growth",
      monthlyMinutes,
      guidance: "Growth is typically the right starting point.",
    };
  }
  return {
    planId: "enterprise",
    monthlyMinutes,
    guidance: "Enterprise scoping is recommended for your volume.",
  };
}
