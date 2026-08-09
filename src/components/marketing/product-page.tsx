import { Link } from "@tanstack/react-router";
import {
  FeatureGrid,
  MarketingCTA,
  MarketingHero,
  MarketingSection,
  MarketingShell,
  MockPanel,
  RelatedLinks,
} from "@/components/marketing/shell";
import type { ProductPageContent } from "@/data/marketing/products";

export function ProductMarketingPage({ product }: { product: ProductPageContent }) {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow={product.eyebrow}
        title={product.title}
        subtitle={product.subtitle}
        actions={
          <>
            <Link
              to={product.primaryCta.href as "/"}
              className="inline-flex rounded-full bg-[#2EE6A6] px-6 py-3 text-sm font-semibold text-[#0B1B33] shadow-lg shadow-[#2EE6A6]/30 hover:bg-[#5cf0bc]"
            >
              {product.primaryCta.label}
            </Link>
            {product.secondaryCta ? (
              <Link
                to={product.secondaryCta.href as "/"}
                className="inline-flex rounded-full border border-[#D7E0EF] bg-white px-6 py-3 text-sm font-semibold text-[#0B1B33] hover:border-[#2EE6A6]"
              >
                {product.secondaryCta.label}
              </Link>
            ) : null}
          </>
        }
      />

      <MarketingSection eyebrow="Capabilities" title="What it does" tone="white">
        <FeatureGrid items={product.features} />
      </MarketingSection>

      <MarketingSection eyebrow="Impact" title={product.why.title} subtitle={product.why.body} tone="soft">
        <div className="grid gap-4 md:grid-cols-3">
          {product.who.map((w) => (
            <div key={w} className="rounded-2xl border border-[#E8EEF7] bg-white px-5 py-4 text-sm text-[#4B5C76]">
              {w}
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection eyebrow="How it works" title="From conversation to action" tone="white">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {product.how.map((step) => (
            <article key={step.step} className="rounded-[1.5rem] border border-[#E8EEF7] p-5">
              <p className="text-xs font-semibold text-[#12C48A]">Step {step.step}</p>
              <h3 className="mt-2 font-semibold text-[#0B1B33]">{step.title}</h3>
              <p className="mt-2 text-sm text-[#4B5C76]">{step.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection eyebrow="Product" title="In the product" tone="soft">
        <ProductMock kind={product.mock ?? "generic"} />
      </MarketingSection>

      <MarketingSection eyebrow="Workflows" title="Key workflows" tone="white">
        <div className="grid gap-4 md:grid-cols-2">
          {product.workflows.map((wf) => (
            <article key={wf.title} className="rounded-[1.5rem] border border-[#E8EEF7] bg-[#F7FAFF] p-6">
              <h3 className="font-semibold text-[#0B1B33]">{wf.title}</h3>
              <p className="mt-2 text-sm text-[#4B5C76]">{wf.body}</p>
            </article>
          ))}
        </div>
      </MarketingSection>

      <RelatedLinks title="Related capabilities" links={product.related} />

      <MarketingCTA
        title="See Artemis in a realistic sales floor demo."
        subtitle="Explore the interactive demo, or talk with us about becoming a design partner."
        primary={product.primaryCta}
        secondary={product.secondaryCta}
      />
    </MarketingShell>
  );
}

function ProductMock({ kind }: { kind: NonNullable<ProductPageContent["mock"]> }) {
  if (kind === "copilot") {
    return (
      <MockPanel title="Live call · Artemis Copilot">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A9BB5]">Active call</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0B1B33]">08:42</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="rounded-xl border border-[#E8EEF7] px-3 py-2">
                <p className="text-[11px] text-[#8A9BB5]">Maria · 08:05</p>
                <p className="mt-1 text-[#0B1B33]">“Have you traded before?”</p>
              </div>
              <div className="rounded-xl border border-[#E8EEF7] bg-[#F7FAFF] px-3 py-2">
                <p className="text-[11px] text-[#8A9BB5]">Client · 08:12</p>
                <p className="mt-1 text-[#0B1B33]">“My biggest concern is getting my money back out.”</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#18C4FF]/25 bg-[#F3FBFF] p-4">
            <p className="text-xs font-semibold text-[#18C4FF]">Objection detected</p>
            <p className="mt-2 text-sm font-semibold text-[#0B1B33]">Withdrawal concern</p>
            <p className="mt-2 text-sm text-[#4B5C76]">
              Resolve trust before discussing funding.
            </p>
            <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs text-[#4B5C76]">
              Suggested: “Let me explain exactly how withdrawals work before anything else.”
            </p>
          </div>
        </div>
      </MockPanel>
    );
  }

  if (kind === "revenue" || kind === "manager") {
    return (
      <MockPanel title={kind === "revenue" ? "Executive overview" : "Manager attention queue"}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Deposits", "€428.5K"],
            ["Conversion", "14.8%"],
            ["Revenue at risk", "€71.4K"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-[#F7FAFF] px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8A9BB5]">{l}</p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#0B1B33]">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#4B5C76]">
          {kind === "revenue"
            ? "Executive brief: conversion improved this week; withdrawal trust remains the top blocker on high-intent leads."
            : "3 agents need attention — missed closes, compliance language, and a live high-intent call."}
        </p>
      </MockPanel>
    );
  }

  return (
    <MockPanel title="Call review">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#E8FFF6] px-4 py-3 text-sm">
          <p className="font-semibold text-[#0B1B33]">What went well</p>
          <p className="mt-1 text-[#4B5C76]">Strong discovery · clear acknowledgment of concern</p>
        </div>
        <div className="rounded-xl bg-[#FFF4E8] px-4 py-3 text-sm">
          <p className="font-semibold text-[#0B1B33]">Missed opportunity</p>
          <p className="mt-1 text-[#4B5C76]">Buying signal at 08:14 — continue toward commitment</p>
        </div>
      </div>
    </MockPanel>
  );
}
