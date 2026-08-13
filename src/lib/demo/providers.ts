/**
 * Demo mode guard — product demos must not trigger live telephony or purchases.
 * Production providers can be swapped in behind the same interfaces later.
 */
export const DEMO_MODE = true as const;

export function assertDemoSafe(action: string): void {
  if (DEMO_MODE) {
    // Intentionally no-op for live side effects in demo builds.
    void action;
  }
}

/** Conceptual voice boundary — Artemis → Voice Gateway → Provider */
export type VoiceProvider = {
  readonly name: string;
  placeCall(input: { to: string; from: string }): Promise<{ callId: string }>;
  endCall(callId: string): Promise<void>;
  purchaseNumber(input: {
    country: string;
    type: string;
  }): Promise<{ number: string }>;
};

export class DemoVoiceProvider implements VoiceProvider {
  readonly name = "demo";

  async placeCall(): Promise<{ callId: string }> {
    assertDemoSafe("placeCall");
    return { callId: `demo-call-${Date.now()}` };
  }

  async endCall(): Promise<void> {
    assertDemoSafe("endCall");
  }

  async purchaseNumber(): Promise<{ number: string }> {
    assertDemoSafe("purchaseNumber");
    return { number: "+00 000 000 0000" };
  }
}

export type AIProviderKind = "demo" | "production";

export interface DemoAIProvider {
  readonly kind: AIProviderKind;
  suggest(input: { transcript: string }): Promise<{ suggestion: string }>;
}

export class MockDemoAIProvider implements DemoAIProvider {
  readonly kind = "demo" as const;

  async suggest(): Promise<{ suggestion: string }> {
    return {
      suggestion:
        "Acknowledge the concern first. Ask which part of the previous experience caused frustration before discussing another deposit.",
    };
  }
}
