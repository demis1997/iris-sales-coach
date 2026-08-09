import type { PromptId } from "@/ai/types/ai.types";

/**
 * Deterministic demo payloads keyed by prompt id.
 * Live copilot returns [] when transcript has no actionable signal.
 */
function extractTranscriptSlice(userPrompt: string): string {
  const start = userPrompt.indexOf("<<<TRANSCRIPT>>>");
  const end = userPrompt.indexOf("<<<END_TRANSCRIPT>>>");
  if (start >= 0 && end > start) {
    return userPrompt.slice(start + "<<<TRANSCRIPT>>>".length, end);
  }
  return userPrompt;
}

export function getMockPayload(promptId: PromptId, userPrompt: string): unknown {
  const transcriptSlice = extractTranscriptSlice(userPrompt);
  const lower = transcriptSlice.toLowerCase();

  switch (promptId) {
    case "call_analysis":
      return {
        summary: "Prospect showed interest with a trust/price concern; follow-up agreed.",
        detailedSummary:
          "The agent opened the call, the prospect raised a concern, and both sides agreed to a follow-up with written information. Conversion did not occur on this call.",
        primaryCustomerObjective: "Evaluate whether to proceed with funding / next step",
        productsDiscussed: ["Core offer"],
        commitments: ["Send written summary"],
        unresolvedIssues: ["Trust or pricing concern not fully resolved"],
        customerSignals: {
          interestLevel: "medium",
          buyingIntent: "medium",
          objections: lower.includes("price") || lower.includes("expensive")
            ? ["Price concern"]
            : lower.includes("withdraw")
              ? ["Withdrawal / trust concern"]
              : ["Needs time"],
          questions: ["Asked for more information"],
          concerns: ["Needs clarity before committing"],
          timingSignals: ["Not ready today"],
          trustSignals: lower.includes("withdraw") || lower.includes("lost money")
            ? ["Prior negative experience or withdrawal concern"]
            : [],
          competitorMentions: [],
        },
        stagesOccurred: ["Opening", "Discovery", "Objection Handling", "Follow-Up"],
        outcome: {
          category: "Follow-up",
          converted: false,
          confidence: 0.62,
          primaryReason: "Unresolved concern; soft next step",
          followUpRequired: true,
          nextBestAction: "Send summary and book a specific callback",
        },
        keyMoments: [
          {
            timestamp: "00:45",
            speaker: "prospect",
            type: "CUSTOMER_CONCERN",
            description: "Prospect expressed hesitation about proceeding.",
            whyItMatters: "This is the primary barrier to conversion on the call.",
          },
          {
            timestamp: "02:10",
            speaker: "agent",
            type: "NEXT_STEP",
            description: "Agent offered a follow-up and written summary.",
            whyItMatters: "Preserves the opportunity but may be too soft without a calendar time.",
          },
        ],
      };

    case "call_scoring":
      return {
        overallScore: 71,
        categories: [
          {
            name: "Opening",
            score: 78,
            status: "SCORED",
            confidence: 0.7,
            evidence: ["Agent stated purpose early"],
            timestamps: ["00:10"],
            explanation: "Purpose was clear.",
            recommendedImprovement: "Add a sharper value hook in the first 20 seconds.",
          },
          {
            name: "Discovery",
            score: 62,
            status: "SCORED",
            confidence: 0.65,
            evidence: ["Limited probing after the concern"],
            timestamps: ["01:20"],
            explanation: "Discovery paused after the first objection.",
            recommendedImprovement: "Ask one quantifying follow-up before pitching.",
          },
          {
            name: "Objection Handling",
            score: 68,
            status: "SCORED",
            confidence: 0.7,
            evidence: ["Acknowledged concern without fully isolating it"],
            timestamps: ["01:40"],
            explanation: "Acknowledgment present; isolation incomplete.",
            recommendedImprovement: "Separate unclear vs expensive / trust before defending.",
          },
          {
            name: "Closing",
            score: 64,
            status: "SCORED",
            confidence: 0.6,
            evidence: ["Soft follow-up offered"],
            timestamps: ["02:10"],
            explanation: "Next step lacks calendar ownership.",
            recommendedImprovement: "Confirm specific time and owner before ending.",
          },
          {
            name: "Compliance",
            score: null,
            status: "NOT_ENOUGH_EVIDENCE",
            confidence: 0.3,
            evidence: [],
            timestamps: [],
            explanation: "Insufficient evidence of required disclosures in the provided transcript.",
          },
        ],
      };

    case "agent_coaching":
      return {
        whatWentWell: [
          {
            behavior: "Acknowledged the prospect's concern calmly",
            timestamp: "01:35",
            evidence: "Agent did not argue immediately after the objection.",
            whyItHelped: "Keeps trust from collapsing.",
            howToRepeat: "Pause, reflect the concern in one sentence, then ask one clarifying question.",
          },
          {
            behavior: "Offered a written follow-up",
            timestamp: "02:10",
            evidence: "Agent proposed sending a summary.",
            whyItHelped: "Gives the prospect a low-friction next step.",
            howToRepeat: "Pair the summary with two concrete callback times.",
          },
        ],
        whatHurtCall: [
          {
            behavior: "Returned to pitch before isolating the concern",
            timestamp: "01:50",
            evidence: "After the concern, agent resumed product talk.",
            whyItMattered: "The unresolved concern likely blocked commitment.",
            whatShouldHaveHappened:
              "Ask what specifically worries them, then address that point with evidence.",
            recommendation: "Isolate before you educate.",
          },
        ],
        missedOpportunities: [
          {
            timestamp: "01:40",
            evidence: "Prospect signaled hesitation that was not explored.",
            recommendation: "Ask one clarifying question before any pitch continuation.",
          },
        ],
        coachingPriorities: [
          "Isolate the primary concern before pitching",
          "Book a calendar-owned next step",
          "Use one quantifying discovery question",
        ],
        nextCallGoal:
          "On the next call, ask one clarifying question after any concern before continuing the pitch.",
        replacementLanguage: [
          {
            situation: "After a trust or price concern",
            phrase:
              "Totally fair — what part feels unclear versus expensive so I can address the right thing?",
          },
        ],
        practiceExercise: {
          title: "Isolate the concern",
          scenario:
            "Prospect says they need to think about it after mentioning a trust or price worry. Practice one clarifying question before any pitch.",
          successCriteria: "Agent asks a clarifying question within 10 seconds of the concern.",
        },
      };

    case "objection_analysis":
      return {
        objections: [
          {
            category: lower.includes("withdraw") ? "Withdrawals" : lower.includes("price") ? "Price" : "Need to Think",
            customerObjection: "Prospect expressed hesitation about proceeding now.",
            timestamp: "01:40",
            agentResponse: "Agent acknowledged and offered follow-up materials.",
            effectiveness: 62,
            why: "Acknowledgment helped, but the root concern was not isolated.",
            resolved: "uncertain",
            betterResponse:
              "What specifically do you want clarity on before we move forward — timing, cost, or how withdrawals/funding work?",
            followUpImplication:
              "Next outreach should open with the unresolved concern, not a fresh pitch.",
          },
        ],
      };

    case "live_copilot": {
      const actionable =
        /object|price|expensive|withdraw|trust|scam|lost money|competitor|ready to|fund|deposit|when can|how much|think about it/i.test(
          transcriptSlice,
        );
      if (!actionable) {
        return { suggestions: [] };
      }
      return {
        suggestions: [
          {
            type: "objection",
            priority: "high",
            shortTitle: "Isolate the concern",
            reason: "Prospect signal suggests hesitation that needs clarification.",
            suggestedAction: "Ask one clarifying question before pitching.",
            optionalPhrase:
              "What specifically feels unclear so I address the right thing?",
            expiresAfterSeconds: 45,
          },
        ],
      };
    }

    case "next_best_action":
      return {
        nextAction: "Send information",
        priority: "High",
        when: "Within 2 hours, then call tomorrow",
        why: "Prospect requested information and did not convert; urgency is moderate, not critical.",
        channel: "Email",
        message:
          "Thanks for the conversation — here's a short recap and two times that work for a follow-up call.",
        dealRisk: "Medium",
        humanReviewRequired: false,
      };

    case "manager_advisor":
      return {
        topPriorities: [
          {
            problem: "Trust/withdrawal concerns are stalling late-stage calls",
            evidence: "Multiple recent analyses show unresolved trust objections before close.",
            agentsAffected: ["Maria Georgiou", "Alex Chen"],
            businessImpact: "Likely suppressing conversion on high-intent leads.",
            recommendedAction: "Run a 20-minute desk drill on isolating trust concerns.",
            priority: "High",
          },
          {
            problem: "Soft next steps without calendar ownership",
            evidence: "Follow-ups often end as 'send something' without booked times.",
            agentsAffected: ["Team Alpha"],
            businessImpact: "Callback leakage and slower conversion cycles.",
            recommendedAction: "Require two proposed times before wrap-up on warm calls.",
            priority: "High",
          },
          {
            problem: "Uneven discovery depth across agents",
            evidence: "Top performers ask clarifying questions; lower performers pitch earlier.",
            agentsAffected: ["Newer agents"],
            businessImpact: "Inconsistent qualification and weaker closes.",
            recommendedAction: "Add one mandatory discovery checkpoint to the playbook.",
            priority: "Medium",
          },
        ],
        agentsNeedingAttention: [
          {
            agent: "Alex Chen",
            issue: "Objection isolation incomplete across recent sample",
            evidence: "Trend across 8+ calls, not a single outlier.",
            recommendedCoaching: "Roleplay trust objection isolation for 15 minutes.",
            callsToReview: ["call-demo-1"],
          },
        ],
        topPerformers: [
          {
            agent: "Maria Georgiou",
            usefulBehavior: "Clarifies concern before pitching product benefits",
            playbookCandidate: true,
            evidence: "Appears in multiple converted or advanced calls.",
          },
        ],
        objectionTrends: {
          increasing: ["Trust", "Withdrawals"],
          resolvedWellBy: ["Maria Georgiou"],
          strugglingAgents: ["Alex Chen"],
          teachNow: "Isolate trust concerns with one clarifying question before educating.",
        },
        coachingPlan: [
          {
            who: "Alex Chen",
            skill: "objection_handling",
            reason: "Repeated incomplete isolation of trust concerns",
            exercise: "3-minute roleplay: lost-money / withdrawal concern",
            deadline: "This week",
          },
        ],
        processProblems: [
          {
            problem: "Follow-up process lacks calendar ownership standard",
            evidence: "Common across multiple agents",
            systemic: true,
          },
        ],
        managerActionPlan: {
          today: ["Review one trust-objection call with Alex"],
          thisWeek: ["Desk drill on concern isolation", "Update wrap-up checklist"],
          watch: ["Conversion on high-intent callbacks"],
        },
      };

    case "executive_advisor":
      return {
        whatChanged: [
          "Conversion appears softer on late-stage trust concerns",
          "Call volume stable while close quality varies by desk",
        ],
        why: [
          "The strongest association appears to be unresolved trust/withdrawal objections before funding steps",
          "Follow-up discipline appears inconsistent across teams",
        ],
        revenueOpportunities: [
          {
            opportunity: "Improve late-stage trust handling on high-intent leads",
            evidence: "Objection patterns concentrate near close",
          },
        ],
        organizationalIssues: [
          {
            issue: "Manager coaching completion may be uneven",
            evidence: "Coaching metrics suggest incomplete follow-through",
            recommendedInvestigation: "Compare coaching completion vs conversion by desk",
          },
        ],
        structuralRecommendations: [
          {
            recommendation: "Pilot a standardized trust-objection playbook section for one desk",
            evidence: "Top performers already use a clarifying-question pattern",
            expectedBenefit: "Higher conversion on hesitant high-intent leads",
            risk: "Over-scripting if applied rigidly",
            howToTest: "A/B two desks for two weeks; compare conversion and objection resolution",
          },
        ],
        top3ActionsThisWeek: [
          "Review trust-objection loss reasons with desk managers",
          "Pilot clarifying-question checkpoint before pitch continuation",
          "Require calendar-owned follow-ups on warm opportunities",
        ],
        risksToWatch: ["Callback leakage", "Repeated withdrawal concerns without better responses"],
        opportunitiesToInvestigate: [
          "Whether top-performer discovery patterns should enter the shared playbook",
        ],
      };

    case "company_diagnosis":
      return {
        findings: [
          {
            area: "PROCESS",
            finding: "Soft follow-ups without booked times are common",
            evidence: "Appears across multiple agents and calls",
            confidence: 0.72,
            scope: "Organization-wide late-stage process",
            estimatedImpact: "Medium — slows conversion cycles",
            recommendedExperiment:
              "Require two proposed callback times before wrap-up for two weeks on one desk",
          },
          {
            area: "TRAINING",
            finding: "Trust/withdrawal concerns are under-isolated before education",
            evidence: "Repeated pattern in objection analyses",
            confidence: 0.68,
            scope: "High-volume outbound desks",
            estimatedImpact: "High if late-stage intent is common",
            recommendedExperiment: "Add a 15-minute daily drill for one week; measure resolution rate",
          },
        ],
      };

    case "winning_behaviors":
      return {
        patterns: [
          {
            behavior: "Ask one clarifying question after a trust concern before pitching",
            winningCallEvidence: ["Converted calls show isolation before education"],
            comparisonEvidence: ["Lost calls often resume pitch immediately"],
            frequency: "Observed across multiple comparable calls",
            confidence: 0.66,
            possiblePlaybookUpdate:
              "Add: after trust/withdrawal concern → clarify → then educate",
          },
        ],
        notes: "Correlation does not prove causation; recommend manager review before playbook change.",
      };

    case "weekly_agent":
      return {
        yourWeek: {
          calls: 42,
          conversions: 5,
          keyImprovement: "Calmer acknowledgment of concerns",
          primaryWeakness: "Not isolating the concern before pitching",
        },
        whatImproved: ["Tone under pressure", "Follow-up offers"],
        whatIsHoldingYouBack: "Pitching before clarifying the main concern",
        bestCall: {
          callId: "best-1",
          why: "You asked a clarifying question and booked a concrete next step.",
        },
        callToReview: {
          callId: "review-1",
          why: "Clear buying hesitation that was left unresolved.",
        },
        nextWeekGoal:
          "After every concern, ask one clarifying question before continuing the pitch.",
        practice: {
          scenario: "Prospect mentions prior losses / withdrawal worry — isolate, then respond.",
        },
      };

    case "weekly_manager":
      return {
        lastWeekInOneSentence:
          "Volume held, but late-stage trust concerns continued to stall conversion.",
        whatImproved: ["Opening consistency", "Coaching assignment completion on Alpha"],
        whatGotWorse: ["Callback ownership", "Withdrawal objection resolution"],
        agentsToPayAttentionTo: ["Alex Chen", "Sam Rivera", "Jordan Lee"],
        biggestLostSaleReason: "Unresolved trust / withdrawal concerns",
        bestBehaviorToCopy: "Clarify the concern before educating",
        coachingPriorities: ["Trust isolation drill", "Calendar-owned follow-ups"],
        top3ManagerActionsThisWeek: [
          "Run trust-objection drill Tuesday",
          "Review two soft-follow-up calls with Alex",
          "Update wrap-up checklist with two proposed times",
        ],
      };

    case "weekly_executive":
      return {
        executiveSummary:
          "Revenue movement appears constrained by late-stage trust concerns rather than top-of-funnel volume. Conversion quality varies by desk. Follow-up ownership remains inconsistent. A focused trust-handling experiment is the clearest near-term lever. No personnel changes are recommended from this brief alone.",
        revenue: "Conversion appears softer on late-stage hesitant leads while volume is stable.",
        why: "Unresolved trust/withdrawal objections appear associated with stalled closes.",
        biggestOpportunity: "Standardize clarifying-question handling before pitch continuation.",
        biggestRisk: "Callback leakage on high-intent leads without calendar ownership.",
        teams: "One desk shows stronger late-stage handling; another lags on objection isolation.",
        management: "Coaching is happening, but process standards for wrap-up are uneven.",
        customerSignal: "Prospects more frequently raise trust, withdrawals, or 'need to think' language.",
        threeDecisionsOrActions: [
          "Approve a two-week trust-objection playbook pilot on one desk",
          "Require calendar-owned follow-ups on warm opportunities",
          "Review objection-resolution rates in next leadership meeting",
        ],
      };

    default:
      return {};
  }
}
