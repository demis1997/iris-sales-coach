/**
 * Knowledge search service.
 * Keyword search today; swap `searchProvider` for embeddings/vector later.
 */

import type { AccessContext } from "@/lib/demo/queries";
import { getVisibleCalls, getVisibleDeals, userById } from "@/lib/demo/queries";
import { analysisByCallId, buildTranscript, playbooks } from "@/lib/demo/seed";
import { listPlaybooks } from "@/lib/demo/operations";
import type { Sentiment } from "@/lib/demo/types";

export type KnowledgeCategory =
  | "Calls"
  | "Moments"
  | "Objections"
  | "Competitors"
  | "Products"
  | "Customer questions"
  | "Best practices"
  | "Playbooks"
  | "Market feedback";

export type KnowledgeResult = {
  id: string;
  type: KnowledgeCategory;
  title: string;
  callId: string | null;
  representativeId: string | null;
  representativeName: string | null;
  date: string | null;
  timestampSec: number | null;
  excerpt: string;
  tags: string[];
  sentiment: Sentiment | "Mixed" | null;
  relatedDealId: string | null;
  relatedDealTitle: string | null;
  score: number;
};

export type SearchOptions = {
  query: string;
  category?: KnowledgeCategory | "All";
  limit?: number;
};

export type SearchProvider = {
  name: string;
  mode: "keyword" | "semantic";
  search: (ctx: AccessContext, options: SearchOptions) => Promise<KnowledgeResult[]>;
};

const SUGGESTED: { label: string; query: string; category: KnowledgeCategory }[] = [
  {
    label: "Show the best responses to pricing objections",
    query: "pricing objection reframe spreads cost",
    category: "Objections",
  },
  {
    label: "What are prospects saying about Competitor X?",
    query: "competitor RivalCo comparison",
    category: "Competitors",
  },
  {
    label: "Which product features are requested most often?",
    query: "feature request product liquidity API",
    category: "Products",
  },
  {
    label: "Find successful first-deposit calls",
    query: "closed first deposit successful",
    category: "Calls",
  },
  {
    label: "Show calls where trust was the main concern",
    query: "trust concern credibility compliance",
    category: "Customer questions",
  },
];

export function getSuggestedQueries() {
  return SUGGESTED;
}

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length > 2);
}

function scoreText(text: string, tokens: string[]) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (lower.includes(t)) score += 1;
  }
  return score;
}

function keywordSearch(ctx: AccessContext, options: SearchOptions): KnowledgeResult[] {
  const tokens = tokenize(options.query);
  if (!tokens.length && !options.query.trim()) return [];

  const calls = getVisibleCalls(ctx);
  const deals = getVisibleDeals(ctx);
  const dealById = Object.fromEntries(deals.map((d) => [d.id, d]));
  const results: KnowledgeResult[] = [];
  const category = options.category ?? "All";
  const allow = (c: KnowledgeCategory) => category === "All" || category === c;

  for (const call of calls) {
    const analysis = analysisByCallId[call.id];
    const rep = userById(call.representativeId);
    const deal = call.dealId ? dealById[call.dealId] : null;
    const blob = [
      call.prospect,
      call.company,
      call.outcome,
      ...(analysis?.topics ?? []),
      ...(analysis?.objections ?? []),
      ...(analysis?.competitors ?? []),
      ...(analysis?.recommendations ?? []),
      ...(analysis?.strengths.map((s) => s.text) ?? []),
      ...(analysis?.weaknesses.map((w) => w.text) ?? []),
    ].join(" ");

    const callScore = tokens.length ? scoreText(blob, tokens) : 0;

    if (
      allow("Calls") &&
      (callScore > 0 || /closed|first|deposit|successful/i.test(options.query))
    ) {
      const boost =
        call.outcome === "Closed" && /closed|deposit|successful/i.test(options.query) ? 3 : 0;
      if (callScore + boost > 0) {
        results.push({
          id: `call-${call.id}`,
          type: "Calls",
          title: `${call.prospect} · ${call.company}`,
          callId: call.id,
          representativeId: call.representativeId,
          representativeName: rep?.name ?? null,
          date: call.startedAt.slice(0, 10),
          timestampSec: null,
          excerpt:
            analysis?.recommendations[0] ??
            `Outcome: ${call.outcome}. Score ${analysis?.overallScore ?? "—"}.`,
          tags: [call.callType, call.outcome, ...(analysis?.topics.slice(0, 2) ?? [])],
          sentiment: analysis?.sentiment ?? null,
          relatedDealId: call.dealId,
          relatedDealTitle: deal?.title ?? null,
          score: callScore + boost + (analysis?.overallScore ?? 0) / 100,
        });
      }
    }

    if (analysis && allow("Objections")) {
      for (const obj of analysis.objections) {
        const s =
          scoreText(obj + " " + blob, tokens) ||
          (/pricing|objection|cost|spread/i.test(options.query) ? 1 : 0);
        if (s > 0) {
          results.push({
            id: `obj-${call.id}-${obj}`,
            type: "Objections",
            title: obj,
            callId: call.id,
            representativeId: call.representativeId,
            representativeName: rep?.name ?? null,
            date: call.startedAt.slice(0, 10),
            timestampSec: analysis.weaknesses[0]?.timestampSec ?? 95,
            excerpt:
              analysis.recommendations.find((r) => /price|objection|reframe/i.test(r)) ??
              analysis.recommendations[0] ??
              "Review objection handling moment.",
            tags: ["objection", ...analysis.topics.slice(0, 1)],
            sentiment: analysis.sentiment,
            relatedDealId: call.dealId,
            relatedDealTitle: deal?.title ?? null,
            score: s + (analysis.objectionHandlingScore >= 80 ? 1 : 0),
          });
        }
      }
    }

    if (analysis && allow("Competitors")) {
      for (const comp of analysis.competitors) {
        const s =
          scoreText(comp + " competitor RivalCo", tokens) ||
          (/competitor|rival/i.test(options.query) ? 1 : 0);
        if (s > 0) {
          results.push({
            id: `comp-${call.id}-${comp}`,
            type: "Competitors",
            title: `Mention: ${comp}`,
            callId: call.id,
            representativeId: call.representativeId,
            representativeName: rep?.name ?? null,
            date: call.startedAt.slice(0, 10),
            timestampSec: 140,
            excerpt: `Prospect referenced ${comp} during evaluation.`,
            tags: ["competitor", comp],
            sentiment: analysis.sentiment,
            relatedDealId: call.dealId,
            relatedDealTitle: deal?.title ?? null,
            score: s,
          });
        }
      }
    }

    if (analysis && allow("Products")) {
      const productHits = analysis.topics.filter((t) =>
        /product|feature|api|liquidity|spread|platform/i.test(t),
      );
      for (const topic of productHits.length ? productHits : analysis.topics.slice(0, 1)) {
        const s =
          scoreText(topic + " feature product request", tokens) ||
          (/feature|product|request/i.test(options.query) ? 1 : 0);
        if (s > 0) {
          results.push({
            id: `prod-${call.id}-${topic}`,
            type: "Products",
            title: topic,
            callId: call.id,
            representativeId: call.representativeId,
            representativeName: rep?.name ?? null,
            date: call.startedAt.slice(0, 10),
            timestampSec: null,
            excerpt: analysis.dealIntel.buyerNeeds[0] ?? `Discussed ${topic} on call.`,
            tags: ["product", topic],
            sentiment: analysis.sentiment,
            relatedDealId: call.dealId,
            relatedDealTitle: deal?.title ?? null,
            score: s,
          });
        }
      }
    }

    if (analysis && allow("Moments")) {
      for (const s of [...analysis.strengths, ...analysis.weaknesses]) {
        const sc = scoreText(s.text, tokens);
        if (
          sc > 0 ||
          (/trust|best|response/i.test(options.query) &&
            sc >= 0 &&
            tokens.some((t) => s.text.toLowerCase().includes(t)))
        ) {
          if (sc > 0 || /trust|pricing|best/i.test(options.query)) {
            const textScore = sc || scoreText(s.text + " trust pricing", tokens);
            if (textScore > 0 || /trust|pricing|best/i.test(options.query)) {
              results.push({
                id: `moment-${call.id}-${s.timestampSec}-${s.text.slice(0, 12)}`,
                type: "Moments",
                title: s.text.slice(0, 80),
                callId: call.id,
                representativeId: call.representativeId,
                representativeName: rep?.name ?? null,
                date: call.startedAt.slice(0, 10),
                timestampSec: s.timestampSec,
                excerpt: s.text,
                tags: ["moment"],
                sentiment: analysis.sentiment,
                relatedDealId: call.dealId,
                relatedDealTitle: deal?.title ?? null,
                score: textScore || 0.5,
              });
            }
          }
        }
      }
    }

    if (
      analysis &&
      allow("Customer questions") &&
      (/trust|question|concern/i.test(options.query) || scoreText(blob, tokens) > 0)
    ) {
      const transcript = buildTranscript(call);
      const prospectLines = transcript.filter((t) => t.speaker === "prospect");
      for (const line of prospectLines.slice(0, 2)) {
        const sc = scoreText(line.text, tokens) || (/trust|concern/i.test(options.query) ? 1 : 0);
        if (sc > 0) {
          results.push({
            id: `q-${call.id}-${line.startTime}`,
            type: "Customer questions",
            title: line.text.slice(0, 72),
            callId: call.id,
            representativeId: call.representativeId,
            representativeName: rep?.name ?? null,
            date: call.startedAt.slice(0, 10),
            timestampSec: line.startTime,
            excerpt: line.text,
            tags: line.tags,
            sentiment: line.sentiment,
            relatedDealId: call.dealId,
            relatedDealTitle: deal?.title ?? null,
            score: sc + (/trust/i.test(line.text) ? 1 : 0),
          });
        }
      }
    }

    if (
      analysis &&
      allow("Best practices") &&
      (analysis.overallScore >= 85 || /best|successful|deposit/i.test(options.query))
    ) {
      const sc =
        scoreText(blob + " best practice successful", tokens) ||
        (analysis.overallScore >= 85 ? 1 : 0);
      if (sc > 0) {
        results.push({
          id: `bp-${call.id}`,
          type: "Best practices",
          title: `High-scoring call · ${call.prospect}`,
          callId: call.id,
          representativeId: call.representativeId,
          representativeName: rep?.name ?? null,
          date: call.startedAt.slice(0, 10),
          timestampSec: analysis.strengths[0]?.timestampSec ?? null,
          excerpt:
            analysis.strengths[0]?.text ?? analysis.recommendations[0] ?? "Strong call pattern.",
          tags: ["best-practice", `score-${analysis.overallScore}`],
          sentiment: analysis.sentiment,
          relatedDealId: call.dealId,
          relatedDealTitle: deal?.title ?? null,
          score: sc + analysis.overallScore / 50,
        });
      }
    }

    if (analysis && allow("Market feedback")) {
      const feedback = [...analysis.dealIntel.painPoints, ...analysis.dealIntel.buyerNeeds];
      for (const f of feedback) {
        const sc = scoreText(f, tokens) || (/feedback|market|request/i.test(options.query) ? 1 : 0);
        if (sc > 0) {
          results.push({
            id: `mf-${call.id}-${f.slice(0, 16)}`,
            type: "Market feedback",
            title: f.slice(0, 72),
            callId: call.id,
            representativeId: call.representativeId,
            representativeName: rep?.name ?? null,
            date: call.startedAt.slice(0, 10),
            timestampSec: null,
            excerpt: f,
            tags: ["market-feedback"],
            sentiment: analysis.sentiment,
            relatedDealId: call.dealId,
            relatedDealTitle: deal?.title ?? null,
            score: sc,
          });
        }
      }
    }
  }

  if (allow("Playbooks")) {
    const pbs = listPlaybooks(ctx.organisationId);
    for (const pb of pbs.length ? pbs : playbooks) {
      const blob = [pb.name, pb.purpose, ...pb.recommendedPhrases, ...pb.requiredBehaviours].join(
        " ",
      );
      const sc =
        scoreText(blob, tokens) || (/playbook|practice|pricing/i.test(options.query) ? 1 : 0);
      if (sc > 0) {
        results.push({
          id: `pb-${pb.id}`,
          type: "Playbooks",
          title: pb.name,
          callId: pb.exampleCallIds[0] ?? null,
          representativeId: null,
          representativeName: null,
          date: null,
          timestampSec: null,
          excerpt: pb.purpose,
          tags: [pb.category, pb.status, pb.scope],
          sentiment: null,
          relatedDealId: null,
          relatedDealTitle: null,
          score: sc + pb.adoptionScore / 100,
        });
      }
    }
  }

  const deduped = new Map<string, KnowledgeResult>();
  for (const r of results) {
    const prev = deduped.get(r.id);
    if (!prev || prev.score < r.score) deduped.set(r.id, r);
  }

  return [...deduped.values()].sort((a, b) => b.score - a.score).slice(0, options.limit ?? 40);
}

/** Keyword provider — default. Replace with vector search implementation later. */
export const keywordSearchProvider: SearchProvider = {
  name: "keyword-v1",
  mode: "keyword",
  async search(ctx, options) {
    // Simulate async boundary for future network/vector calls
    await Promise.resolve();
    return keywordSearch(ctx, options);
  },
};

let activeProvider: SearchProvider = keywordSearchProvider;

export function setSearchProvider(provider: SearchProvider) {
  activeProvider = provider;
}

export function getSearchProvider() {
  return activeProvider;
}

export async function searchKnowledge(ctx: AccessContext, options: SearchOptions) {
  return activeProvider.search(ctx, options);
}
