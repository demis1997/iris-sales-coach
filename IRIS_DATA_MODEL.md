# Iris data model

Typed in `src/lib/demo/types.ts`. Demo seed: `src/lib/demo/seed.ts`. No SQL migrations yet — this document is the contract for a future database.

## Core entities

### Organisation
`id`, `name`, `industry`, `timezone`, `settings` (languages, consent, retention), `createdAt`

### User
`id`, `organisationId`, `teamId`, `role`, `name`, `email`, `status` (`active` | `invited` | `disabled`), `title`, `createdAt`

### Team
`id`, `organisationId`, `managerId`, `name`, `office`

### Call
`id`, `organisationId`, `teamId`, `representativeId`, `externalId`, `source`, `startedAt`, `durationSec`, `recordingUrl`, `language`, `callType`, `outcome`, `dealId`, `analysisStatus`, plus demo fields `prospect`, `company`, `coachingStatus`, `reviewed`

### CallAnalysis
`id`, `callId`, `organisationId`, scores (overall, discovery, listening, confidence, pitch, objectionHandling, closing, playbook), `sentiment`, strengths/weaknesses, recommendations, topics, objections, competitors, nextSteps, risks, `dealIntel`

### TranscriptSegment
Built via `buildTranscript(call)` — `id`, `callId`, `organisationId`, speaker, times, text, sentiment, tags

### Deal
Pipeline opportunity with EUR `value`, stage, risk, forecast confidence, conversation health, CRM sync fields

### CoachingItem
Skill, evidence, recommendation, status, due dates, related calls, progress, behaviourImproved

### Playbook / PlaybookVersion
Purpose, behaviours, phrases, example calls, adoption, version history

### TrainingModule / TrainingAssignment / RoleplaySession
Learning content, assignments, AI roleplay outcomes

### Alert / Insight
Org-scoped notifications and narrative insights

### IntegrationRecord
Conceptual row for provider status/configuration (runtime also in integrations catalog + localStorage)

### AuditLog
Sensitive action trail (`src/lib/security/audit.ts`)

### Lead
Book-demo capture (`src/lib/leads/store.ts` / `Lead` type)

## Consistency rules

Enforced by `validateSeedCoherence()`:

- Representative profile scores = average of analysed call overall scores
- High-risk pipeline KPI = sum of open high-risk deal values
- Coaching `relatedCallIds` and playbook examples resolve to real calls
- All currency values are EUR in the Apex seed
- Active representatives ≥ 10; teams ≥ 3; deals ≥ 25; calls ≥ 30

## Tenant rule

Every org-owned row carries `organisationId`. Queries compare against **session** organisation id — never a client-supplied org override.
