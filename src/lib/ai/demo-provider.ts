import type { AiProvider } from "@/lib/ai/types";
import { answerAskIris } from "@/lib/demo/ask-iris";

/** Deterministic demo AI — no network, no secrets. */
export const demoAiProvider: AiProvider = {
  name: "demo",

  async analyseCall({ call, transcriptText }) {
    const pricedEarly = /price|spread|cost/i.test(transcriptText.slice(0, 400));
    const hasNext = /thursday|friday|calendar|kickoff|workshop/i.test(transcriptText);
    const overall = Math.max(45, Math.min(96, (pricedEarly ? 62 : 84) + (hasNext ? 8 : -6)));
    return {
      overallScore: overall,
      discoveryScore: pricedEarly ? overall - 12 : overall + 2,
      listeningScore: overall - 4,
      confidenceScore: overall,
      pitchScore: overall - 2,
      objectionHandlingScore: pricedEarly ? overall - 10 : overall,
      closingScore: hasNext ? overall + 3 : overall - 15,
      playbookScore: pricedEarly ? overall - 14 : overall,
      sentiment: overall >= 80 ? "Positive" : overall >= 65 ? "Mixed" : "Negative",
      recommendations: [
        pricedEarly
          ? "Establish value before discussing commercial terms."
          : "Capture winning phrases from this call into the playbook.",
        hasNext
          ? "Confirm the next step owner in CRM."
          : "Book a dated next step before hanging up.",
      ],
      organisationId: call.organisationId,
    };
  },

  async generateCoaching({ analysis, skillHint }) {
    const skill =
      skillHint ??
      (analysis.discoveryScore < 75
        ? "Discovery"
        : analysis.objectionHandlingScore < 75
          ? "Objection handling"
          : "Next-step discipline");
    return {
      skill,
      evidence: analysis.weaknesses[0]?.text ?? `Score ${analysis.overallScore} on recent call.`,
      recommendation: analysis.recommendations[0] ?? "Practise the related playbook drill.",
      suggestedExercise: `Roleplay: ${skill.toLowerCase()} for ten minutes, then review transcript moments.`,
    };
  },

  async generateFollowUpEmail({ call, analysis, recipientName }) {
    const next = analysis.nextSteps[0] ?? "a short follow-up to confirm next steps";
    return {
      subject: `Following up — ${call.company}`,
      body: `Hi ${recipientName.split(" ")[0]},\n\nThank you for the conversation today. As discussed, next step is ${next}.\n\nI will send any materials we promised and look forward to continuing.\n\nBest regards`,
    };
  },

  async generateCrmUpdate({ analysis }) {
    return {
      nextStep: analysis.nextSteps[0] ?? "No agreed next step — needs follow-up",
      sentiment: analysis.sentiment,
      risk: analysis.dealIntel.riskLevel,
      summary: analysis.recommendations[0] ?? "Call analysed by Iris (demo).",
    };
  },

  async askIris({ ctx, question, callId }) {
    return answerAskIris(ctx, question, { callId });
  },

  async generatePlaybook({ theme }) {
    return {
      name: `${theme} playbook`,
      purpose: `Repeatable behaviours for ${theme.toLowerCase()} conversations.`,
      recommendedPhrases: [
        "Before we talk numbers, what does success look like for your desk?",
        "Who else weighs in on this decision?",
      ],
      phrasesToAvoid: ["Our price is the lowest", "Just trust me on this"],
    };
  },

  async roleplayFeedback({ scenario, objection }) {
    return {
      overallScore: 74,
      strengths: ["Acknowledged the concern", "Asked a clarifying question"],
      missedOpportunities: [`Did not fully reframe “${objection}” with evidence`],
      suggestedResponse: `For ${scenario}: acknowledge, quantify impact, then offer a low-risk next step.`,
    };
  },
};
