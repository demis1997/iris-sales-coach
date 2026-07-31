import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  CircleHelp,
  ClipboardList,
  Database,
  LineChart,
  Mic2,
  PhoneCall,
  Search,
  Shield,
  Sparkles,
  Target,
  Users,
  Workflow,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard, Reveal, Section } from "@/components/marketing/ui";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function OutcomeStrip() {
  const items = [
    {
      title: "Close more opportunities",
      text: "Surface what converts on real calls and remove friction before deals stall.",
    },
    {
      title: "Coach every representative",
      text: "Deliver specific guidance after every conversation—without waiting for a manager.",
    },
    {
      title: "Forecast revenue with confidence",
      text: "Ground pipeline health in buyer conversations, not optimistic CRM updates.",
    },
    {
      title: "Turn top-performer behaviour into team playbooks",
      text: "Capture winning patterns and make them the company standard.",
    },
  ];

  return (
    <section className="border-b border-border bg-secondary/20">
      <div className="container-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-12">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ProblemSection() {
  const problems = [
    "Representatives repeat the same mistakes",
    "CRM records are incomplete",
    "Coaching depends on manager availability",
    "Pipeline forecasts rely on subjective updates",
    "Winning behaviours stay inside individual employees",
    "Deal risks are often discovered too late",
  ];

  const withoutIris = [
    "Manual call reviews",
    "Inconsistent coaching",
    "Incomplete CRM notes",
    "Subjective forecasting",
    "Hidden revenue risk",
  ];

  const withIris = [
    "Every conversation analysed",
    "Personalised coaching at scale",
    "Automatic CRM updates",
    "Conversation-based forecasting",
    "Early risk detection",
  ];

  return (
    <Section
      eyebrow="The problem"
      title="Managers cannot listen to every call. Iris can."
      lede="High-volume sales teams produce thousands of conversations. Without a system that learns from all of them, performance stays uneven and revenue risk stays invisible."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p} delay={i * 0.03}>
            <ContentCard className="flex items-start gap-3 py-4">
              <CircleHelp className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-sm text-foreground">{p}</p>
            </ContentCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Reveal>
          <ContentCard className="h-full">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Without Iris
            </p>
            <ul className="mt-4 space-y-3">
              {withoutIris.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive/80" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </ContentCard>
        </Reveal>
        <Reveal delay={0.08}>
          <ContentCard className="h-full border-primary/25 bg-primary/5">
            <p className="text-xs font-medium tracking-wide text-primary uppercase">With Iris</p>
            <ul className="mt-4 space-y-3">
              {withIris.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </ContentCard>
        </Reveal>
      </div>
    </Section>
  );
}

export function WorkflowSection() {
  const steps: { title: string; text: string; icon: LucideIcon }[] = [
    {
      title: "Sales conversation",
      text: "Capture calls from dialers, meetings, and uploaded recordings.",
      icon: PhoneCall,
    },
    {
      title: "Transcription & speakers",
      text: "Identify speakers and produce a searchable transcript.",
      icon: Mic2,
    },
    {
      title: "AI conversation analysis",
      text: "Score discovery, objections, next steps, sentiment, and risk.",
      icon: Brain,
    },
    {
      title: "Representative coaching",
      text: "Deliver specific guidance and practice before the next call.",
      icon: Sparkles,
    },
    {
      title: "CRM & follow-up automation",
      text: "Draft notes, tasks, and emails so admin does not stall selling.",
      icon: ClipboardList,
    },
    {
      title: "Manager & executive intelligence",
      text: "Surface coaching priorities, pipeline risk, and revenue drivers.",
      icon: LineChart,
    },
  ];

  return (
    <Section
      id="workflow"
      eyebrow="How Iris works"
      title="From conversation to organisational intelligence"
      lede="Iris connects analysis, coaching, CRM hygiene, and leadership visibility into one operating loop."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.04}>
            <ContentCard className="h-full">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg border border-border bg-secondary/50">
                  <step.icon className="size-4 text-primary" aria-hidden />
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </ContentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const capabilities: {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
}[] = [
  {
    title: "AI Sales Coach",
    description:
      "Give every representative a private coach that reviews every conversation and provides specific, actionable guidance before the next call.",
    items: [
      "Call scoring",
      "Discovery analysis",
      "Talk-to-listen ratio",
      "Objection handling",
      "Next-call recommendations",
      "Personal improvement plans",
    ],
    icon: Sparkles,
  },
  {
    title: "Manager Intelligence",
    description:
      "See exactly who needs support, why deals are being lost, and where coaching will have the greatest impact.",
    items: [
      "Team performance overview",
      "Coaching priorities",
      "Skill-gap detection",
      "Call-quality alerts",
      "Representative comparisons",
      "Coaching assignment workflows",
    ],
    icon: Users,
  },
  {
    title: "Pipeline Intelligence",
    description:
      "Use real sales conversations—not subjective CRM updates—to understand which deals are progressing and which are at risk.",
    items: [
      "Deal-risk detection",
      "Buyer sentiment",
      "Competitor mentions",
      "Missing decision-makers",
      "Next-step detection",
      "Forecast confidence",
    ],
    icon: Target,
  },
  {
    title: "AI Playbooks",
    description:
      "Identify the behaviours of top performers and turn them into repeatable playbooks for the entire organisation.",
    items: [
      "Winning phrase detection",
      "Best-call library",
      "Objection-response libraries",
      "Playbook compliance",
      "Industry-specific scripts",
      "Automatic recommendations",
    ],
    icon: BookOpen,
  },
  {
    title: "Training and Roleplay",
    description: "Create personalised training based on each representative’s real weaknesses.",
    items: [
      "AI roleplay",
      "Objection simulations",
      "Personal learning paths",
      "Training assignments",
      "Progress tracking",
      "New-hire onboarding",
    ],
    icon: Workflow,
  },
  {
    title: "CRM Automation",
    description:
      "Keep the CRM accurate without asking representatives to spend additional time on administration.",
    items: [
      "Automatic summaries",
      "Deal and contact updates",
      "Follow-up tasks",
      "Email drafts",
      "Stage suggestions",
      "Structured call notes",
    ],
    icon: Database,
  },
  {
    title: "Executive Intelligence",
    description:
      "Give leadership a real-time view of sales performance, pipeline quality, coaching impact, and revenue risk.",
    items: [
      "Revenue influenced",
      "Pipeline health",
      "Forecast accuracy",
      "Conversion drivers",
      "Coaching ROI",
      "Risk alerts",
    ],
    icon: LineChart,
  },
  {
    title: "Conversation Knowledge Base",
    description: "Turn every conversation into searchable company knowledge.",
    items: [
      "Semantic call search",
      "Objection library",
      "Competitor intelligence",
      "Best-call examples",
      "Customer-language insights",
      "Product-feedback extraction",
    ],
    icon: Search,
  },
];

export function CapabilitiesSection() {
  return (
    <Section
      id="platform"
      eyebrow="Platform"
      title="One operating system for conversation-driven sales"
      lede="Iris is not a pile of disconnected AI features. Analysis feeds coaching, coaching feeds playbooks, and conversations feed forecasting and CRM hygiene."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {capabilities.map((cap, i) => (
          <Reveal key={cap.title} delay={(i % 4) * 0.04}>
            <ContentCard className="h-full">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40">
                  <cap.icon className="size-4 text-primary" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {cap.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="size-3.5 shrink-0 text-primary/80" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </ContentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function RolesSection() {
  const roles = [
    {
      title: "For sales representatives",
      headline: "A private AI coach for every call.",
      benefits: [
        "Know exactly what to improve",
        "Prepare for the next conversation",
        "Practise difficult objections",
        "Track personal development",
        "Reduce CRM administration",
        "Learn from the organisation’s best calls",
      ],
      cta: "Explore Iris for representatives",
      to: "/solutions/sales-representatives" as const,
    },
    {
      title: "For sales managers",
      headline: "Coach the right person on the right skill.",
      benefits: [
        "Stop manually reviewing random calls",
        "Identify team-wide skill gaps",
        "Prioritise coaching by expected impact",
        "Track whether coaching changes behaviour",
        "Compare teams and representatives fairly",
        "Find examples from top performers",
      ],
      cta: "Explore Iris for managers",
      to: "/solutions/sales-managers" as const,
    },
    {
      title: "For executives",
      headline: "Understand what is driving—or threatening—revenue.",
      benefits: [
        "See pipeline risk early",
        "Understand conversion drivers",
        "Track team productivity",
        "Measure coaching impact",
        "Compare branches, teams, and markets",
        "Improve forecast confidence",
      ],
      cta: "Explore Iris for executives",
      to: "/solutions/executives" as const,
    },
  ];

  return (
    <Section
      eyebrow="Built for every role"
      title="The same conversations. Different decisions."
      lede="Representatives improve after every call. Managers coach with evidence. Executives see revenue risk before it hits the board pack."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {roles.map((role, i) => (
          <Reveal key={role.title} delay={i * 0.06}>
            <ContentCard className="flex h-full flex-col">
              <p className="text-[11px] font-medium tracking-wide text-primary uppercase">
                {role.title}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{role.headline}</h3>
              <ul className="mt-5 flex-1 space-y-2.5">
                {role.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to={role.to}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {role.cta} <ArrowRight className="size-3.5" />
              </Link>
            </ContentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function AssistantSection() {
  const questions = [
    "Why is the Cyprus team’s close rate falling?",
    "Which opportunities are most likely to be lost?",
    "What do our top performers do differently?",
    "Which representatives need objection-handling training?",
    "What concerns are prospects mentioning most often?",
    "How did coaching affect performance this month?",
  ];

  return (
    <Section
      eyebrow="Ask Iris"
      title="Ask Iris what is happening across your sales organisation."
      lede="Natural-language questions over your conversations, coaching, and pipeline—answered with evidence, not slogans."
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <ContentCard>
            <p className="text-xs font-medium text-muted-foreground">Example questions</p>
            <ul className="mt-4 space-y-2">
              {questions.map((q) => (
                <li
                  key={q}
                  className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-foreground"
                >
                  {q}
                </li>
              ))}
            </ul>
          </ContentCard>
        </Reveal>
        <Reveal delay={0.08}>
          <ContentCard className="border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <p className="text-xs font-medium text-primary">Example Iris response · demo</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">
              Close rates declined primarily because pricing was introduced before sufficient
              discovery in 41% of lost calls. Representatives Elena and Andreas show the largest gap
              compared with the top-performing group. Assign the “Value Before Price” playbook and
              review the five highlighted calls.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Illustrative demo content. Responses in your workspace cite your calls and teams.
            </p>
          </ContentCard>
        </Reveal>
      </div>
    </Section>
  );
}

export function PipelineDemoSection() {
  const rows = [
    {
      opp: "Feldman Capital · Liquidity",
      rep: "Alex Moreau",
      stage: "Negotiation",
      value: "€84K",
      sentiment: "Positive",
      risk: "Low",
      main: "—",
      action: "Confirm rollout date",
    },
    {
      opp: "Meridian FX · Onboarding",
      rep: "Priya Nair",
      stage: "Proposal",
      value: "€62K",
      sentiment: "Mixed",
      risk: "High",
      main: "Pricing hesitation",
      action: "Revisit value discovery",
    },
    {
      opp: "Northgate Realty",
      rep: "Tom Beckett",
      stage: "Discovery",
      value: "€41K",
      sentiment: "Neutral",
      risk: "Medium",
      main: "Decision-maker absent",
      action: "Book stakeholder call",
    },
    {
      opp: "Aurora Insurance",
      rep: "Lena Fischer",
      stage: "Follow-up",
      value: "€28K",
      sentiment: "Negative",
      risk: "High",
      main: "Competitor evaluation",
      action: "Share comparison pack",
    },
    {
      opp: "Vault Trading",
      rep: "Omar Haddad",
      stage: "Proposal",
      value: "€55K",
      sentiment: "Mixed",
      risk: "Medium",
      main: "No agreed next step",
      action: "Lock calendar commitment",
    },
  ];

  return (
    <Section
      eyebrow="Pipeline intelligence"
      title="See risk in the conversation—not only in the CRM stage."
      lede="Illustrative demo table. In production, Iris scores opportunity health from actual buyer dialogue."
    >
      <Reveal>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                {[
                  "Opportunity",
                  "Representative",
                  "Stage",
                  "Value",
                  "Sentiment",
                  "Risk",
                  "Main risk",
                  "Recommended action",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.opp} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-medium">{r.opp}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.rep}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.stage}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{r.value}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.sentiment}</td>
                  <td className="px-3 py-3">
                    <RiskPill level={r.risk} />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{r.main}</td>
                  <td className="px-3 py-3">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

function RiskPill({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
        level === "High" && "bg-destructive/15 text-destructive",
        level === "Medium" && "bg-warning/15 text-warning",
        level === "Low" && "bg-success/15 text-success",
      )}
    >
      {level}
    </span>
  );
}

export function PlaybookSection() {
  const insights = [
    "Top performers ask more discovery questions before discussing price.",
    "Successful calls establish value before pricing.",
    "Mentioning a specific operational benefit correlates with stronger follow-up rates.",
    "Certain objection responses result in more booked next steps.",
  ];

  return (
    <Section
      eyebrow="Playbook intelligence"
      title="Turn your best calls into the company standard."
      lede="Iris surfaces patterns from top-performing conversations so every desk can execute the same play. Patterns below are illustrative demo insights."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight, i) => (
          <Reveal key={insight} delay={i * 0.05}>
            <ContentCard className="flex gap-3">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-relaxed text-foreground">{insight}</p>
            </ContentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function IndustriesSection() {
  const industries = [
    {
      title: "Forex and brokerages",
      text: "High volume, multilingual desks, first-deposit conversion, and script adherence.",
      to: "/industries/forex" as const,
    },
    {
      title: "Financial services",
      text: "Complex products, longer cycles, and conversation-backed forecast confidence.",
      to: "/industries/financial-services" as const,
    },
    {
      title: "Call centres",
      text: "Quality at scale, coaching queues, and consistent handling across shifts.",
      to: "/industries/call-centres" as const,
    },
    {
      title: "Real estate",
      text: "Objection patterns, urgency, and next-step discipline across agent teams.",
      to: "/industries/real-estate" as const,
    },
    {
      title: "Recruitment",
      text: "Candidate and client conversations that reveal what actually converts.",
      to: "/solutions" as const,
    },
    {
      title: "B2B SaaS",
      text: "Discovery quality, MEDDIC-style signals, and expansion risk detection.",
      to: "/solutions" as const,
    },
    {
      title: "Insurance",
      text: "Disclosure monitoring, needs analysis, and renewal conversation quality.",
      to: "/solutions" as const,
    },
  ];

  return (
    <Section
      eyebrow="Industries"
      title="Designed for teams where conversations are the business"
      lede="Iris adapts scorecards, playbooks, and risk signals to how your floor actually sells."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((ind, i) => (
          <Reveal key={ind.title} delay={i * 0.03}>
            <Link to={ind.to} className="block h-full">
              <ContentCard className="h-full transition-colors hover:border-primary/40">
                <h3 className="text-sm font-semibold">{ind.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ind.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Learn more <ArrowRight className="size-3" />
                </span>
              </ContentCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function SecurityTeaser() {
  const items = [
    { label: "Encryption in transit", status: "Supported" },
    { label: "Role-based permissions", status: "Supported" },
    { label: "Tenant isolation", status: "Architecture" },
    { label: "Audit logs", status: "Roadmap" },
    { label: "Configurable retention", status: "Roadmap" },
    { label: "SSO for enterprise", status: "Roadmap" },
  ];

  return (
    <Section
      eyebrow="Security"
      title="Built for sensitive sales conversations."
      lede="We only claim what the platform supports today. Certifications and advanced enterprise controls are listed as roadmap where they are not yet shipped."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <ContentCard key={item.label} className="flex items-center justify-between gap-3 py-4">
                <span className="flex items-center gap-2 text-sm">
                  <Shield className="size-4 text-primary" aria-hidden />
                  {item.label}
                </span>
                <span className="text-[11px] text-muted-foreground">{item.status}</span>
              </ContentCard>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ContentCard className="flex h-full flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold">Security programme</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Read how Iris handles data lifecycle, access, AI data use, and enterprise review
                requests. We do not claim SOC 2, ISO 27001, or GDPR certification unless achieved.
              </p>
            </div>
            <Button className="mt-6 w-fit" variant="outline" asChild>
              <Link
                to="/security"
                onClick={() => track("security_page_viewed", { source: "home_teaser" })}
              >
                View security
              </Link>
            </Button>
          </ContentCard>
        </Reveal>
      </div>
    </Section>
  );
}

export function UseCasesSection() {
  const cases = [
    "Coach 100 representatives without hiring more managers",
    "Detect weak discovery before pipeline reviews",
    "Standardise objection handling across offices",
    "Reduce time spent writing call notes",
    "Understand why leads fail to convert",
    "Onboard new representatives using real call examples",
  ];

  return (
    <Section
      eyebrow="Outcomes"
      title="Designed for teams where every conversation matters."
      lede="Customer logos and testimonials will appear here once we have permission to publish them. Until then, these are the problems Iris is built to solve."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c, i) => (
          <Reveal key={c} delay={i * 0.03}>
            <ContentCard>
              <p className="text-sm leading-relaxed">{c}</p>
            </ContentCard>
          </Reveal>
        ))}
      </div>
      {/* Placeholder for future testimonials / case studies */}
      <div className="sr-only" data-testimonials-slot="pending" />
    </Section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="border-t border-border">
      <div className="container-page py-20 text-center md:py-28">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-4xl">
            Your team is already producing the data. Iris turns it into performance.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            See how Iris can analyse your conversations, coach your team, and reveal what is
            driving revenue.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link
                to="/book-demo"
                onClick={() => track("book_demo_cta_clicked", { source: "final_cta" })}
              >
                Book a personalised demo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                to="/product"
                onClick={() => track("explore_platform_clicked", { source: "final_cta" })}
              >
                Explore the platform
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
