import type { AccessContext } from "@/lib/demo/queries";
import { getAnalysis, getCallById, userById } from "@/lib/demo/queries";
import { analysisByCallId } from "@/lib/demo/seed";

export type AskArtemisMessage = { role: "user" | "assistant"; content: string };

/**
 * Deterministic demo assistant. Swap `answerAskArtemis` for a model provider later.
 */
export async function answerAskArtemis(
  ctx: AccessContext,
  question: string,
  scope?: { callId?: string },
): Promise<string> {
  const q = question.toLowerCase();

  if (scope?.callId) {
    const call = getCallById(ctx, scope.callId);
    const analysis = getAnalysis(ctx, scope.callId);
    if (!call || !analysis) {
      return "I cannot access that call with your current permissions, or it does not exist in this organisation.";
    }
    const rep = userById(call.representativeId)?.name ?? "the representative";

    if (q.includes("scored poorly") || (q.includes("why") && q.includes("score"))) {
      if (analysis.overallScore >= 85) {
        return `This call scored ${analysis.overallScore}/100 — that is strong. Strengths: ${analysis.strengths.map((s) => s.text).join("; ") || "solid structure"}.`;
      }
      return `This call scored ${analysis.overallScore}/100 primarily because: ${
        analysis.weaknesses.map((w) => w.text).join("; ") || "key stages underperformed"
      }. Listening ${analysis.listeningScore}, discovery ${analysis.discoveryScore}, objection handling ${analysis.objectionHandlingScore}.`;
    }
    if (q.includes("differently") || q.includes("improve")) {
      return `${rep} should focus on: ${
        analysis.recommendations.join(" ") || "Tighten discovery before commercial discussion."
      }`;
    }
    if (q.includes("objection")) {
      return analysis.objections.length
        ? `The primary objection themes were: ${analysis.objections.join(", ")}. ${
            analysis.objectionHandlingScore < 75
              ? "Handling was partial — practise acknowledge → reframe → evidence."
              : "Handling was relatively strong."
          }`
        : "No major objections were tagged on this call.";
    }
    if (q.includes("next step")) {
      return analysis.nextSteps.length
        ? `Yes — agreed next step: ${analysis.nextSteps.join("; ")}.`
        : "No clear next step was detected. That reduced closing and forecast confidence.";
    }
    if (q.includes("playbook")) {
      return analysis.weaknesses.some((w) => /pric/i.test(w.text))
        ? "Assign the Value Before Price playbook, then review the pricing moment on the timeline."
        : analysis.nextSteps.length
          ? "Reinforce the Next-step discipline playbook — this call already shows the pattern."
          : "Start with Next-step discipline and Discovery fundamentals.";
    }
  }

  if (q.includes("cyprus") || q.includes("close rate")) {
    return "Close rates declined primarily because pricing was introduced before sufficient discovery in a large share of friction calls. Elena and Andreas show the largest gap versus the top-performing group. Assign the Value Before Price playbook and review the highlighted calls.";
  }
  if (q.includes("lost") || q.includes("at risk") || q.includes("opportunities")) {
    return "Highest-risk open opportunities include Meridian FX, Aurora Insurance, BluePeak Capital, Nordic Pensions, Peninsula Life, and Delta Spreads — mainly pricing hesitation, missing decision-makers, or competitor evaluation.";
  }
  if (q.includes("top perform")) {
    return "Top performers ask more discovery questions, establish value before pricing, and book a dated next step live. Closed-won calls in the demo set consistently show mutual next steps.";
  }
  if (q.includes("objection-handling") || q.includes("training")) {
    return "Priority trainees: Omar Haddad (discovery/listening), Andreas Papas and Elena Christou (value before price), Diego Ramos (next-step discipline).";
  }
  if (q.includes("coaching affect") || q.includes("this month")) {
    return "Demo coaching impact trend shows average scores rising from ~68 to ~81 across four weeks for coached cohorts. Completed items (e.g. Priya authority check) correlate with cleaner follow-ups.";
  }

  // Fallback grounded in visible analysis averages
  const scores = Object.values(analysisByCallId)
    .filter((a) => a.organisationId === ctx.organisationId && a.overallScore > 0)
    .map((a) => a.overallScore);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  return `Organisation average analysed-call score in the demo seed is ${avg}/100. Ask about a specific call, pipeline risk, coaching priorities, or top-performer behaviours for a sharper answer.`;
}

export const SUGGESTED_PROMPTS = [
  "Why was this call scored poorly?",
  "What should the representative do differently?",
  "What objection was most important?",
  "Was there a clear next step?",
  "Which playbook should be assigned?",
];
