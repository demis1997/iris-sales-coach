# Artemis Rebuild Plan

**Positioning:** Artemis — The AI Operating System for High-Performance Sales Teams  
**Value prop:** Every sales conversation makes your entire team smarter.

---

## 1. Audit summary

| Area | Current state | Decision |
| --- | --- | --- |
| Framework | TanStack Start + Router (file routes), Vite 8, React 19, Bun | **Retain** |
| UI kit | shadcn/Radix under `src/components/ui/`, Lucide, CVA, Motion, Recharts | **Retain** |
| Styling | Tailwind 4 + CSS tokens; dark purple/violet “AI SaaS” look | **Refactor** → restrained slate + single accent; less gradient noise |
| Landing | Single-page `/` with `#` anchors; marketing copy leads with call scoring | **Replace** public site structure & copy |
| App (`/app`) | Rep workspace: dashboard, calls, coach, performance, goals, leaderboard, settings | **Retain** for now; rebuild in next phase |
| Exec (`/ceo`) | Executive dashboards, employees, alerts, insights | **Retain** for now; rebuild in next phase |
| Data | `src/lib/artemis-data.ts` demo fixtures (no DB/auth) | **Retain**; expand coherently in product phase |
| Auth | None — `/app` and `/ceo` are open demo shells | **Preserve**; `/login` is UI entry → demo workspaces |
| Deploy | Lovable + Nitro/Cloudflare via `@lovable.dev/vite-tanstack-config` | **Retain** |
| SEO | Basic root + homepage meta; `robots.txt` allow-all | **Add** per-route meta, OG, sitemap |

**No real database, integrations, or certifications.** Public claims must stay honest (roadmap vs shipped).

---

## 2. Phase scope (this delivery)

**In scope now**

1. Design-system token refresh + shared marketing primitives  
2. Global public nav + footer (working links only)  
3. Full public route tree (product, solutions, industries, integrations, pricing, security, book-demo, login, legal/company placeholders)  
4. Homepage rebuilt as outcome-led sales OS narrative  
5. SEO helpers, sitemap, robots, analytics event stub  

**Out of scope now (next phase)**

- Authenticated product shell IA (Overview → Settings)  
- Expanded demo domain model / RBAC  
- Onboarding wizard  
- Deep call-detail / pipeline / playbook product screens  

Existing `/app` and `/ceo` remain reachable and functional.

---

## 3. Retain / refactor / replace / add

### Retain
- TanStack file routing, `__root.tsx` shell, QueryClient  
- `src/components/ui/*`, `cn()`, Lucide  
- `AppShell`, dashboard routes, `artemis-data.ts`  
- Motion + Recharts for previews/charts  

### Refactor
- Colour tokens, radius, shadows, glass utilities  
- `ArtemisMark` brand mark  
- Meta title/description defaults  

### Replace (public only)
- `src/routes/index.tsx` composition and old landing section wiring  
- Footer / nav that pointed at `#` dead ends  

### Add
- `src/components/marketing/*` — layout, header, footer, homepage sections  
- Public routes listed in the brief  
- `src/lib/seo.ts`, `src/lib/analytics.ts`  
- `public/sitemap.xml` updates  
- Company/legal placeholder pages  

Old `src/components/landing/*` kept on disk but unused by the new homepage (safe to delete later).

---

## 4. Public information architecture

```
/                          Homepage
/product                   Platform capabilities
/solutions                 Role overview
/solutions/sales-representatives
/solutions/sales-managers
/solutions/executives
/industries/forex
/industries/call-centres
/industries/financial-services
/industries/real-estate
/integrations
/pricing
/security
/book-demo
/login
/about /contact /careers
/privacy /terms /cookies /data-processing
```

Primary CTA everywhere: **Book a demo** → `/book-demo`  
Secondary: Explore platform → `/product` or `#platform` / demo preview.

---

## 5. Design system direction

- Near-black / cool slate surfaces (enterprise, not neon)  
- Single accent (refined blue) — no violet rainbow hero gradients  
- Soft 1px borders, light elevation, radius ~10–12px  
- Geist (existing) for UI; clear type hierarchy  
- Demo product UI in hero must look like a real dashboard preview  

---

## 6. Honesty rules (copy & UI)

- No fake logos or testimonials  
- Integrations marked Available / In development / Planned  
- Security: describe controls & roadmap; no SOC 2 / ISO / “GDPR compliant” claims  
- Metrics labelled as **illustrative demo data**  
- No “Start free trial”  

---

## 7. Later phases (authenticated product)

1. Role-aware app shell + Overview KPI dashboard  
2. Calls list + call detail (player, transcript, analysis)  
3. Coaching, Team, Pipeline, Playbooks, Training, Knowledge, Reports  
4. Integrations & Settings  
5. Coherent demo seed model + onboarding  

---

## 8. Success criteria for this phase

- [x] Artemis reads as a sales OS within 5 seconds on `/`
- [x] All public nav/footer links resolve
- [x] Book demo + login flows work (UI + validation)
- [x] No unsupported security/customer claims
- [x] `/app` and `/ceo` still load
- [x] Per-page SEO meta present
- [x] Responsive desktop → mobile

**Status:** Rebuild complete through engineering/quality pass — domain model refined, AI/auth/tenant layers, vitest suite (21), docs (`README`, architecture/data/security), a11y/perf hardening, route smoke green. Remains a demo (no production DB/auth/AI).
