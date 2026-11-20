# 2. Review findings: scaling, database, flow, scope and alternatives

The single-VPS plan is adequate for Phase 1 volumes, the data model needs one structural change (separate `applications` from `users`), and the journey should be reordered so sensitive data is collected last.

### 2.1 Scaling risks

| Risk | Assessment | Action |
| --- | --- | --- |
| VPS size unknown | Two Next.js apps, NestJS, a job worker, NGINX and Postgres-adjacent tooling need headroom. | Minimum 4 GB RAM and 2 vCPU. Confirm the actual plan. Set container memory limits so one service cannot starve the rest. |
| Single point of failure | A 99.5% target allows about 3.6 hours of downtime a month. | Acceptable for Phase 1 if monitored. Keep a restore-tested backup and a documented rebuild that takes under two hours. |
| No Redis | Rate limiting, queues and caching normally use it. | Edge rate limits in Cloudflare, in-process limits in NestJS (one instance), jobs in Postgres with pg-boss. No new infrastructure. |
| Reminder and purge jobs | Time-based work needs durable scheduling, not `setTimeout`. | pg-boss scheduled jobs in a separate worker container. |
| Video traffic | The video gate and training videos are heavy. | Never serve video from the VPS. Use Cloudflare Stream or Supabase Storage behind Cloudflare cache. Decide the host before Sprint 2. |
| Hosted database latency | VPS to hosted Postgres adds a network hop per query. | Pick the Supabase region nearest the VPS. Use connection pooling (the pooler endpoint). Keep endpoints coarse so a request needs few queries. |
| Supabase plan limits | The free plan pauses idle projects and offers limited backups; verify current terms. | Start on the paid plan. Holding ID documents on a plan without point-in-time recovery is not acceptable. |
| Interviewer capacity | The real limit on growth. | Cohort intake and a waitlist, with a dashboard showing slots against queue length. |

### 2.2 Database design issues in the requirements

- **User and application are conflated.** A rejected person who reapplies needs a new attempt with its own history, scores and documents. Add an `applications` table; a user owns many, one is active.
- **Three overlapping logs.** `verification_events`, `admin_actions` and `audit_log` describe the same thing. Use two: `application_state_history` (domain transitions) and `audit_log` (every admin action and every sensitive read).
- **Missing tables.** Consents and legal document versions, availability, bookings, cohorts and waitlist, rejection reasons, appeals, site settings, email templates, content assets, push subscriptions, ID duplicate fingerprints, and a Phase 2 public profile view.
- **Reminders and attendance are events, not states.** `INTERVIEW_REMINDED`, `TRAINING_REMINDED` and `*_ATTENDED` belong in notification and booking tables. This cuts the state machine from 22 states to 13 progress states plus four side states.
- **Sensitive declarations mixed with answers.** Criminal-history and removal-from-program answers go in a separate restricted table with a narrower role.
- **Hash of an ID number is weak.** ID numbers have low entropy, so a plain hash can be reversed. Use a keyed hash (HMAC with a server secret) and never store the number.
- **Immutability is asserted, not enforced.** Revoke `UPDATE` and `DELETE` on the two log tables for the application role, and chain row hashes so tampering is detectable.
- **Translations.** Interface strings live in files in the repository. Only admin-managed content (questions, emails, legal text, subtitles) lives in the database.

### 2.3 User-flow issues

1. **Sensitive data is collected too early.** The documents ask for the ID before the questionnaire is reviewed. Reverse it: questionnaire first, admin triage, then ID request. This protects applicants who would be rejected anyway and saves the ID review queue.
2. **The video gate has no text alternative.** Gating registration on a video fails accessibility rules for deaf users and low-bandwidth users. Provide captions and a transcript, and treat the transcript as completion for accessibility.
3. **The journey is long and opaque.** Show one persistent status page with the current step, the next action, the expected wait and who is acting (you or us).
4. **No exit.** Applicants cannot pause, withdraw or ask for deletion. Add all three.
5. **Reschedule rules conflict with a third-party scheduler.** A hosted scheduler cannot enforce "two reschedules, then admin approval" against our state machine without after-the-fact webhooks.
6. **No-show path is undefined for the interviewer.** Add interviewer no-show, auto-rebook and an apology email.
7. **Rejection is a dead end.** Give a reason category, whether reapplication is allowed, and the date it opens.
8. **Language is promised everywhere, supported nowhere in review.** Free-text answers in a language the reviewer cannot read stall review. Fix the launch locales to what reviewers can read, or add a reviewer-language field.

### 2.4 MVP scope issues

The backlog has about 45 P0 stories for eight sprints. These cuts keep the launch honest.

| Item | Decision | Reason |
| --- | --- | --- |
| Phone OTP and SMS fallback | Defer | Contradicts the no-SMS constraint; interview gives stronger assurance. |
| Device fingerprinting | Drop | Weak control, adds consent burden. |
| Interview and training recording | Defer | Consent and storage policy are unsolved. |
| Translation workflow UI | Simplify | Translation status per row and export/import; no approval workflow. |
| Analytics dashboards | Simplify | PostHog funnels plus five SQL views in the admin; no custom dashboard builder. |
| Ticket bulk actions, SLA countdown widgets | Defer | Filters and a due-date column are enough. |
| Session device list | Defer | Supabase sign-out-all is enough. |
| RTL layouts | Simplify | Use CSS logical properties now; do not test full RTL until an RTL locale is chosen. |
| Safety fast lane | Keep | Non-negotiable for a platform in this domain. |
| Audit log, admin MFA, ID encryption and purge | Keep | Core trust promise. |

### 2.5 Better alternatives where justified

| Decision | Documents say | Recommendation | Reason |
| --- | --- | --- | --- |
| Scheduler | Cal.com | Build a small scheduler inside NestJS (availability rules, slot generation, bookings, ICS files) | The domain rules (unlock on ID approval, reschedule caps, round-robin, state coupling) are the product. Cal.com cannot enforce them natively. Fallback: Cal.com cloud with webhooks if you prefer speed over control. |
| Auth authority | Supabase and NestJS both implied | Supabase Auth issues sessions; NestJS verifies JWTs; sign-up disabled on the client | One identity system, built-in email verification and TOTP MFA. |
| Background jobs | Not specified; no Redis | pg-boss on Postgres | Durable, transactional with state changes, no new service. |
| Upload safety | Antivirus implied | Accept images only, re-encode with `sharp` in the API | Re-encoding removes embedded payloads and metadata and avoids a ClamAV container that needs about 1 GB of RAM. |
| Training fee | Paid, stubbed | Free, or refundable as payout credit | Removes the advance-fee perception and the payment dependency from the critical path. |
| Monorepo | Three apps implied | One repository with pnpm and Turborepo: `web`, `admin`, `api`, shared packages | Shared types and one CI. |
| Analytics | PostHog or Amplitude or Metabase | PostHog cloud for product events; SQL views for operations | No second tool to host. |
| Database access | Not specified | Prisma with hand-written SQL migrations for RLS, triggers and partial indexes | Typed access plus the Postgres features that matter here. |
