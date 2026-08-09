export type ProductPageContent = {
  slug: string;
  path: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  features: { title: string; body: string }[];
  why: { title: string; body: string };
  how: { step: string; title: string; body: string }[];
  who: string[];
  workflows: { title: string; body: string }[];
  related: { label: string; href: string; description: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  mock?: "copilot" | "revenue" | "coach" | "manager" | "generic";
};

export const PRODUCTS: ProductPageContent[] = [
  {
    slug: "artemis-copilot",
    path: "/artemis-copilot",
    navLabel: "Artemis Copilot",
    eyebrow: "Live guidance",
    title: "Your AI copilot for every sales conversation.",
    subtitle:
      "Give agents real-time guidance while they speak — from objection handling and discovery prompts to closing signals and compliance reminders.",
    seoTitle: "Artemis Copilot | Real-Time AI Sales Coaching",
    seoDescription:
      "Real-time AI guidance for sales conversations — objections, buying intent, suggested responses, and playbook prompts during the call.",
    features: [
      {
        title: "Live objection detection",
        body: "Surface the objection as it appears so the agent can address it before the conversation drifts.",
      },
      {
        title: "Buying intent signals",
        body: "Highlight moments when the prospect softens — so agents know when to move toward commitment.",
      },
      {
        title: "Suggested responses",
        body: "Offer phrasing grounded in your playbooks. Agents choose when to use it — Artemis does not speak for them.",
      },
      {
        title: "Call stage awareness",
        body: "Track opening, discovery, qualification, objections, and closing so coaching matches where the call actually is.",
      },
      {
        title: "Relevant playbook retrieval",
        body: "Pull the right guidance for the moment — withdrawal concerns, pricing, compliance, or product questions.",
      },
      {
        title: "Compliance prompts",
        body: "Remind agents of required disclosures and risk language without turning the UI into a surveillance panel.",
      },
      {
        title: "Post-call transition",
        body: "When the call ends, move straight into coaching, wrap-up, and next best action.",
      },
    ],
    why: {
      title: "Why it matters",
      body: "Most coaching arrives hours or days later. Artemis sits beside the agent during the conversation — when behavior can still change the outcome.",
    },
    how: [
      { step: "1", title: "Listen", body: "The conversation is transcribed and structured in real time." },
      { step: "2", title: "Detect", body: "Signals, objections, and stage shifts surface as the call progresses." },
      { step: "3", title: "Guide", body: "Suggestions and playbooks appear when they are useful — not as noise." },
      { step: "4", title: "Improve", body: "After the call, coaching captures what worked and what was missed." },
    ],
    who: ["Sales agents on live outbound or inbound calls", "Managers monitoring the floor", "Training leads building talk tracks"],
    workflows: [
      { title: "Outbound high-intent lead", body: "Guide discovery, handle trust objections, and catch buying signals before they pass." },
      { title: "Callback / follow-up", body: "Resume context, reinforce prior commitments, and move toward the next clear step." },
      { title: "Compliance-sensitive pitch", body: "Keep required language visible without interrupting the sales flow." },
    ],
    related: [
      { label: "AI Coaching", href: "/ai-coaching", description: "Personal coaching after every call." },
      { label: "Adaptive Playbooks", href: "/adaptive-playbooks", description: "Turn winning talk tracks into live guidance." },
      { label: "Call Intelligence", href: "/call-intelligence", description: "Structured intelligence from every conversation." },
    ],
    primaryCta: { label: "Explore Agent Demo", href: "/demo/agent/live" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "copilot",
  },
  {
    slug: "conversation-intelligence",
    path: "/conversation-intelligence",
    navLabel: "Conversation Intelligence",
    eyebrow: "Intelligence layer",
    title: "Understand every conversation.",
    subtitle:
      "Transcription, topics, objections, intent, and searchable moments — the foundation under live guidance and revenue intelligence.",
    seoTitle: "Conversation Intelligence | Artemis AI",
    seoDescription:
      "Turn sales conversations into structured intelligence — transcripts, summaries, topics, objections, intent, and searchable moments.",
    features: [
      { title: "Transcription", body: "Capture the conversation as searchable text for coaching and review." },
      { title: "Call summaries", body: "Concise recaps of what happened, what was promised, and what comes next." },
      { title: "Topics & objections", body: "Structure the conversation into themes managers and executives can act on." },
      { title: "Customer intent", body: "Estimate buying readiness from evidence in the call — not guesswork." },
      { title: "Key moments", body: "Jump to the seconds that changed the outcome." },
      { title: "Outcomes & search", body: "Filter by outcome, objection, agent, or phrase across the desk." },
    ],
    why: {
      title: "Why it matters",
      body: "Conversation intelligence is not the product by itself. It is the layer that makes coaching, live guidance, and executive reporting possible.",
    },
    how: [
      { step: "1", title: "Capture", body: "Calls enter Artemis from upload or telephony workflows." },
      { step: "2", title: "Structure", body: "Transcripts, topics, and signals become queryable records." },
      { step: "3", title: "Activate", body: "Downstream products use that structure for coaching and revenue views." },
    ],
    who: ["QA reviewers", "Managers", "Revenue operations"],
    workflows: [
      { title: "Find similar lost calls", body: "Search by objection language and compare how top agents handled it." },
      { title: "Calibrate scoring", body: "Review evidence behind AI scores with transcript context." },
    ],
    related: [
      { label: "Call Intelligence", href: "/call-intelligence", description: "Every call as a structured record." },
      { label: "Revenue Intelligence", href: "/revenue-intelligence", description: "Why revenue is moving." },
      { label: "Artemis Copilot", href: "/artemis-copilot", description: "Guidance during the call." },
    ],
    primaryCta: { label: "Explore the Demo", href: "/demo" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "generic",
  },
  {
    slug: "revenue-intelligence",
    path: "/revenue-intelligence",
    navLabel: "Revenue Intelligence",
    eyebrow: "For revenue leaders",
    title: "Know why revenue is moving.",
    subtitle:
      "Conversion, revenue at risk, lost reasons, team comparison, and executive briefs grounded in conversation evidence.",
    seoTitle: "Revenue Intelligence | Artemis AI",
    seoDescription:
      "Executive revenue intelligence from sales conversations — conversion trends, revenue at risk, lost reasons, and coaching impact.",
    features: [
      { title: "Conversion trends", body: "See where the funnel improves or stalls across desks." },
      { title: "Revenue at risk", body: "Surface high-intent opportunities that still need follow-up." },
      { title: "Lost opportunity reasons", body: "Understand why deals stall — trust, price, timing, and more." },
      { title: "Team comparison", body: "Compare desks on quality, conversion, and coaching completion." },
      { title: "High-intent prospects", body: "Prioritize the conversations most likely to convert." },
      { title: "Coaching impact", body: "Connect coaching activity to conversion movement over time." },
      { title: "Executive AI brief", body: "A concise weekly narrative of what changed and where to intervene." },
    ],
    why: {
      title: "Why it matters",
      body: "CRMs store outcomes. Artemis explains the conversation behavior driving those outcomes.",
    },
    how: [
      { step: "1", title: "Aggregate", body: "Calls, scores, and outcomes roll into desk and company views." },
      { step: "2", title: "Explain", body: "AI briefs highlight drivers — not vanity dashboards." },
      { step: "3", title: "Act", body: "Jump into teams, opportunities, or coaching that need attention." },
    ],
    who: ["CEOs", "Heads of Sales", "Revenue operations"],
    workflows: [
      { title: "Monday executive review", body: "Read the brief, inspect revenue at risk, assign desk focus." },
      { title: "Desk deep-dive", body: "Open an underperforming team and follow evidence into calls." },
    ],
    related: [
      { label: "Executive Command Center", href: "/executive-command-center", description: "The CEO operating surface." },
      { label: "Manager Operations", href: "/manager-operations", description: "Where intervention happens." },
      { label: "Conversation Intelligence", href: "/conversation-intelligence", description: "The data underneath." },
    ],
    primaryCta: { label: "Explore CEO Demo", href: "/demo/ceo" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "revenue",
  },
  {
    slug: "rep-dna",
    path: "/rep-dna",
    navLabel: "Rep DNA",
    eyebrow: "Skill model",
    title: "Understand how every rep sells.",
    subtitle:
      "A living skill profile built from real conversations — discovery, listening, objection handling, closing, and more — with evidence managers can trust.",
    seoTitle: "Rep DNA | Sales Skill Intelligence | Artemis AI",
    seoDescription:
      "Rep DNA builds an evidence-based skill model for every salesperson from real calls — strengths, gaps, and coaching focus.",
    features: [
      { title: "Discovery", body: "How well the rep uncovers needs before pitching." },
      { title: "Listening", body: "Talk ratio, interruptions, and response quality." },
      { title: "Confidence", body: "Clarity and composure under pressure." },
      { title: "Objection handling", body: "Whether concerns are acknowledged and resolved." },
      { title: "Closing", body: "Whether buying signals become clear next steps." },
      { title: "Product knowledge", body: "Accuracy and relevance of explanations." },
      { title: "Compliance", body: "Adherence to required language and process." },
    ],
    why: {
      title: "Why it matters",
      body: "Managers should not coach from memory of a handful of calls. Rep DNA updates from evidence after every conversation.",
    },
    how: [
      { step: "1", title: "Score", body: "Each call contributes skill signals with transcript references." },
      { step: "2", title: "Model", body: "Profiles update over time — strengths, gaps, and trajectory." },
      { step: "3", title: "Coach", body: "Recommendations point to concrete behaviors, not personality labels." },
    ],
    who: ["Agents improving week to week", "Managers assigning coaching", "Trainers designing practice"],
    workflows: [
      { title: "Weekly 1:1", body: "Open Rep DNA, review evidence clips, set one focus skill." },
      { title: "Ramp new hires", body: "Track skill progress against your best performers." },
    ],
    related: [
      { label: "AI Coaching", href: "/ai-coaching", description: "After-call improvement loops." },
      { label: "AI Roleplay", href: "/ai-roleplay", description: "Practice the weak skill before live calls." },
      { label: "Manager Operations", href: "/manager-operations", description: "Who needs attention." },
    ],
    primaryCta: { label: "Explore Agent Demo", href: "/demo/agent" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "generic",
  },
  {
    slug: "ai-coaching",
    path: "/ai-coaching",
    navLabel: "AI Coaching",
    eyebrow: "After every call",
    title: "Personal coaching after every call.",
    subtitle:
      "What went well, what cost the opportunity, transcript evidence, better phrasing, and a clear next-call goal.",
    seoTitle: "AI Coaching | Artemis AI",
    seoDescription:
      "Personalized post-call coaching with transcript evidence, better phrasing, and next-call goals for high-volume sales teams.",
    features: [
      { title: "What went well", body: "Reinforce behaviors worth repeating." },
      { title: "What cost the opportunity", body: "Name the moment that mattered — with a timestamp." },
      { title: "Transcript evidence", body: "Coaching is tied to what was actually said." },
      { title: "Better phrasing", body: "Show a concrete alternative for the next similar moment." },
      { title: "Next-call goal", body: "One focused behavior to practice immediately." },
      { title: "Manager assignments", body: "Escalate patterns that need human coaching." },
      { title: "Skill improvement", body: "Feed progress back into Rep DNA over time." },
    ],
    why: {
      title: "Why it matters",
      body: "Agents improve when feedback is immediate, specific, and fair — not when it arrives as a monthly spreadsheet.",
    },
    how: [
      { step: "1", title: "Analyze", body: "The call is scored and key moments are identified." },
      { step: "2", title: "Explain", body: "Coaching cites evidence and proposes better language." },
      { step: "3", title: "Practice", body: "Agents can jump into roleplay for the same scenario." },
    ],
    who: ["Sales agents", "Team managers", "Enablement"],
    workflows: [
      { title: "Missed close review", body: "Jump to the buying signal, learn the alternative close, practice it." },
      { title: "Manager coaching queue", body: "Assign follow-up when the same weakness repeats." },
    ],
    related: [
      { label: "Artemis Copilot", href: "/artemis-copilot", description: "Guidance during the call." },
      { label: "AI Roleplay", href: "/ai-roleplay", description: "Practice the fix." },
      { label: "Rep DNA", href: "/rep-dna", description: "Track skill progress." },
    ],
    primaryCta: { label: "Explore Agent Coach", href: "/demo/agent/coach" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "coach",
  },
  {
    slug: "ai-roleplay",
    path: "/ai-roleplay",
    navLabel: "AI Roleplay",
    eyebrow: "Practice",
    title: "Practice before talking to customers.",
    subtitle:
      "Simulate tough prospects, score the practice, and certify readiness before campaigns go live.",
    seoTitle: "AI Roleplay | Sales Practice Simulations | Artemis AI",
    seoDescription:
      "AI customer simulations for sales practice — objections, difficulty levels, scoring, and campaign readiness certifications.",
    features: [
      { title: "AI customer simulation", body: "Practice against realistic buyer behavior." },
      { title: "Manager-created scenarios", body: "Build scenarios from real objections on your floor." },
      { title: "Difficulty levels", body: "Ramp difficulty as reps improve." },
      { title: "Call scoring", body: "Score practice the same way you score live calls." },
      { title: "Certifications", body: "Gate campaigns until practice standards are met." },
      { title: "Campaign readiness", body: "Know who is ready before volume ramps." },
    ],
    why: {
      title: "Why it matters",
      body: "The most expensive practice is a live lead. Roleplay moves learning earlier — before revenue is on the line.",
    },
    how: [
      { step: "1", title: "Define", body: "Managers set the scenario, objection, and success criteria." },
      { step: "2", title: "Practice", body: "Agents run the simulation and receive scored feedback." },
      { step: "3", title: "Certify", body: "Ready agents unlock campaigns; others keep practicing." },
    ],
    who: ["New hires", "Agents working a skill gap", "Managers launching a campaign"],
    workflows: [
      { title: "Trust objection drill", body: "Practice withdrawal concerns before EU registration campaigns." },
      { title: "Certification gate", body: "Require a passing score before assigning a new product pitch." },
    ],
    related: [
      { label: "AI Coaching", href: "/ai-coaching", description: "Turn live misses into practice scenarios." },
      { label: "Adaptive Playbooks", href: "/adaptive-playbooks", description: "Practice the talk tracks that win." },
      { label: "Rep DNA", href: "/rep-dna", description: "See which skills need practice." },
    ],
    primaryCta: { label: "Explore Practice Demo", href: "/demo/agent/practice" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "generic",
  },
  {
    slug: "manager-operations",
    path: "/manager-operations",
    navLabel: "Manager Operations Center",
    eyebrow: "For sales managers",
    title: "Run the floor without listening to every call.",
    subtitle:
      "Attention queues, live floor, coaching assignments, and call evidence — so managers intervene where it changes outcomes.",
    seoTitle: "Manager Operations Center | Artemis AI",
    seoDescription:
      "Sales manager operations — attention queues, live floor, coaching assignments, team performance, and call evidence.",
    features: [
      { title: "Attention queue", body: "See who needs help and why — ranked by impact." },
      { title: "Live floor", body: "Monitor active calls and AI signals without joining every line." },
      { title: "Call review", body: "Open the moments that matter with transcript evidence." },
      { title: "Top objections", body: "Know what is blocking conversion across the desk today." },
      { title: "Team performance", body: "Compare agents on quality, conversion, and coaching progress." },
      { title: "Coaching assignments", body: "Assign focused work with due dates and evidence." },
      { title: "Compliance flags", body: "Route risky conversations to human review." },
    ],
    why: {
      title: "Why it matters",
      body: "Managers cannot listen to every call. Artemis shows where attention creates the most improvement.",
    },
    how: [
      { step: "1", title: "Prioritize", body: "Start from the attention queue, not a recording pile." },
      { step: "2", title: "Inspect", body: "Open evidence, live assists, or agent skill gaps." },
      { step: "3", title: "Assign", body: "Create coaching or roleplay that targets the real weakness." },
    ],
    who: ["Team managers", "Floor supervisors", "QA leads"],
    workflows: [
      { title: "Morning floor start", body: "Review attention cards, check live calls, unblock agents." },
      { title: "Coaching Friday", body: "Clear the queue, assign practice, track completion." },
    ],
    related: [
      { label: "Rep DNA", href: "/rep-dna", description: "Evidence behind each agent." },
      { label: "AI Coaching", href: "/ai-coaching", description: "What agents see after calls." },
      { label: "Executive Command Center", href: "/executive-command-center", description: "Company-wide view." },
    ],
    primaryCta: { label: "Explore Manager Demo", href: "/demo/manager" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "manager",
  },
  {
    slug: "executive-command-center",
    path: "/executive-command-center",
    navLabel: "Executive Command Center",
    eyebrow: "For leadership",
    title: "See what's actually driving revenue.",
    subtitle:
      "Revenue, conversion, teams, manager effectiveness, revenue at risk, and an executive brief you can act on.",
    seoTitle: "Executive Command Center | Artemis AI",
    seoDescription:
      "Executive command center for high-volume sales — revenue, conversion, teams, opportunities, and AI executive briefs.",
    features: [
      { title: "Revenue & deposits", body: "Track the numbers leadership already cares about." },
      { title: "Teams & managers", body: "See which desks and managers are moving conversion." },
      { title: "Revenue at risk", body: "Prioritize high-intent opportunities still open." },
      { title: "Lost opportunities", body: "Understand systemic reasons deals stall." },
      { title: "Pipeline health", body: "Connect conversation quality to funnel stages." },
      { title: "Executive AI brief", body: "A clear weekly narrative with links into action." },
    ],
    why: {
      title: "Why it matters",
      body: "Leadership should not wait for end-of-month reports to learn why conversion moved.",
    },
    how: [
      { step: "1", title: "Orient", body: "Read KPIs and the executive brief." },
      { step: "2", title: "Drill", body: "Open teams, opportunities, or loss reasons." },
      { step: "3", title: "Align", body: "Push focus into manager operations and coaching." },
    ],
    who: ["CEOs", "CROs", "Sales directors"],
    workflows: [
      { title: "Weekly leadership meeting", body: "Brief → risk → desks → decisions." },
      { title: "Campaign postmortem", body: "Compare conversion and objection patterns before/after." },
    ],
    related: [
      { label: "Revenue Intelligence", href: "/revenue-intelligence", description: "Why revenue moves." },
      { label: "Manager Operations", href: "/manager-operations", description: "Where the work gets done." },
      { label: "Adaptive Playbooks", href: "/adaptive-playbooks", description: "Systematize what wins." },
    ],
    primaryCta: { label: "Explore CEO Demo", href: "/demo/ceo" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "revenue",
  },
  {
    slug: "adaptive-playbooks",
    path: "/adaptive-playbooks",
    navLabel: "Adaptive Playbooks",
    eyebrow: "Company knowledge",
    title: "Turn your best conversations into better playbooks.",
    subtitle:
      "Winning talk tracks, objection responses, and company knowledge that feed live copilot, coaching, and roleplay.",
    seoTitle: "Adaptive Playbooks | Artemis AI",
    seoDescription:
      "Build adaptive sales playbooks from winning conversations — used in live copilot, coaching, and roleplay.",
    features: [
      { title: "Winning talk tracks", body: "Capture what top agents actually say when they win." },
      { title: "Objection responses", body: "Standardize strong answers without scripting robots." },
      { title: "Company knowledge", body: "Pricing, policies, and product facts agents can retrieve." },
      { title: "Automatic recommendations", body: "Surface the right playbook for the moment." },
      { title: "Versioning", body: "Update guidance as products and regulations change." },
      { title: "Live + practice usage", body: "Same playbooks power copilot and roleplay." },
    ],
    why: {
      title: "Why it matters",
      body: "Static PDFs do not coach anyone. Adaptive playbooks keep institutional knowledge alive in the tools agents already use.",
    },
    how: [
      { step: "1", title: "Collect", body: "Promote winning calls and approved responses into playbooks." },
      { step: "2", title: "Distribute", body: "Copilot and roleplay retrieve the current version." },
      { step: "3", title: "Refine", body: "Managers update playbooks as patterns change." },
    ],
    who: ["Enablement", "Managers", "Compliance reviewers"],
    workflows: [
      { title: "New product launch", body: "Publish talk tracks, certify via roleplay, assist live calls." },
      { title: "Objection spike", body: "Update the response, push to copilot the same day." },
    ],
    related: [
      { label: "Artemis Copilot", href: "/artemis-copilot", description: "Playbooks during the call." },
      { label: "AI Roleplay", href: "/ai-roleplay", description: "Practice playbook scenarios." },
      { label: "Call Intelligence", href: "/call-intelligence", description: "Find winning moments." },
    ],
    primaryCta: { label: "Explore the Demo", href: "/demo" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "generic",
  },
  {
    slug: "call-intelligence",
    path: "/call-intelligence",
    navLabel: "Call Intelligence",
    eyebrow: "Every conversation",
    title: "Every call becomes structured intelligence.",
    subtitle:
      "Transcript, scores, intent, objections, buying signals, next best action, and follow-up generation in one record.",
    seoTitle: "Call Intelligence | Artemis AI",
    seoDescription:
      "Structured call intelligence — transcripts, scores, intent, objections, buying signals, and next best actions.",
    features: [
      { title: "Transcript & audio", body: "Review the conversation with timestamps." },
      { title: "Scores", body: "Dimension scores tied to evidence." },
      { title: "Customer intent", body: "High / medium / low with supporting moments." },
      { title: "Objections & signals", body: "What blocked or advanced the deal." },
      { title: "Next best action", body: "A clear follow-up with suggested messaging." },
      { title: "Follow-up generation", body: "Draft WhatsApp or email from the call context." },
    ],
    why: {
      title: "Why it matters",
      body: "A call should not disappear into a recording archive. It should become a durable record that improves the next conversation.",
    },
    how: [
      { step: "1", title: "Ingest", body: "Capture the call and produce a structured analysis." },
      { step: "2", title: "Decide", body: "Agents and managers act on coaching and next steps." },
      { step: "3", title: "Learn", body: "Signals feed Rep DNA, playbooks, and revenue views." },
    ],
    who: ["Agents", "Managers", "QA"],
    workflows: [
      { title: "Post-call wrap-up", body: "Confirm outcome, send follow-up, schedule next touch." },
      { title: "Manager review", body: "Open the call from an attention card and assign coaching." },
    ],
    related: [
      { label: "Conversation Intelligence", href: "/conversation-intelligence", description: "The layer underneath." },
      { label: "AI Coaching", href: "/ai-coaching", description: "What to improve next." },
      { label: "Artemis Copilot", href: "/artemis-copilot", description: "Guidance while speaking." },
    ],
    primaryCta: { label: "Explore Agent Demo", href: "/demo/agent" },
    secondaryCta: { label: "Book a Demo", href: "/contact" },
    mock: "coach",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
