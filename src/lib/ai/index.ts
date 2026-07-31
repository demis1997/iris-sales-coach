import type { AiProvider } from "@/lib/ai/types";
import { demoAiProvider } from "@/lib/ai/demo-provider";
import { getConfiguredProviderName } from "@/lib/ai/types";

/**
 * Production stub — activates only when ARTEMIS_AI_PROVIDER / VITE_AI_PROVIDER=production
 * and a server-side key is configured. Falls back to demo with a clear message.
 */
export const productionAiProvider: AiProvider = {
  name: "production",
  async analyseCall(req) {
    if (!hasServerAiCredentials()) {
      return {
        ...(await demoAiProvider.analyseCall(req)),
        recommendations: [
          "AI provider not configured — showing demo analysis fallback.",
          ...((await demoAiProvider.analyseCall(req)).recommendations ?? []),
        ],
      };
    }
    // Future: call server route /api/ai/analyse with org-scoped auth.
    return demoAiProvider.analyseCall(req);
  },
  generateCoaching: (req) => demoAiProvider.generateCoaching(req),
  generateFollowUpEmail: (req) => demoAiProvider.generateFollowUpEmail(req),
  generateCrmUpdate: (req) => demoAiProvider.generateCrmUpdate(req),
  askArtemis: (req) => demoAiProvider.askArtemis(req),
  generatePlaybook: (req) => demoAiProvider.generatePlaybook(req),
  roleplayFeedback: (req) => demoAiProvider.roleplayFeedback(req),
};

function hasServerAiCredentials() {
  if (typeof process === "undefined") return false;
  return Boolean(process.env.ARTEMIS_AI_API_KEY);
}

let override: AiProvider | null = null;

export function setAiProvider(provider: AiProvider | null) {
  override = provider;
}

export function getAiProvider(): AiProvider {
  if (override) return override;
  return getConfiguredProviderName() === "production" ? productionAiProvider : demoAiProvider;
}

export async function askArtemisSafe(
  ...args: Parameters<AiProvider["askArtemis"]>
): Promise<{ ok: true; answer: string } | { ok: false; error: string }> {
  try {
    const answer = await getAiProvider().askArtemis(...args);
    return { ok: true, answer };
  } catch {
    return {
      ok: false,
      error: "Artemis could not answer right now. Try again or open the related call detail.",
    };
  }
}
