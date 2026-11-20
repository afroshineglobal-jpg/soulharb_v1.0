# 7. Backend module design

One NestJS modular monolith, with each domain as a module that owns its tables and exposes services, never repositories, to other modules. Long-running and timed work runs in a separate worker container from the same codebase.

### 7.1 Repository layout

- `apps/web` Next.js listener PWA, `apps/admin` Next.js admin portal, `apps/api` NestJS API, `apps/worker` NestJS standalone worker.
- `packages/shared` types and Zod schemas, `packages/ui` components, `packages/i18n` message files, `packages/config` lint, TypeScript and Tailwind presets.

### 7.2 Modules

| Module | Responsibility | Depends on |
| --- | --- | --- |
| `auth` | Supabase JWT verification, MFA level check, registration orchestration, admin invite | `gate`, `legal`, `notifications` |
| `gate` | Video session tokens, progress heartbeats, completion token issue and verify | `content` |
| `applications` | The state machine, `transition()` is the only writer of state, history rows, timeline view | all domain modules call it |
| `profile` | Listener profile, photo handling | `storage`, `legal` |
| `legal` | Document versions, consents, age gate evidence | none |
| `verification` | ID and selfie upload, re-encoding, encryption, reviews, duplicate fingerprints, purge | `storage`, `audit`, `applications` |
| `questionnaire` | Versions, questions, answers, scoring, reviews, sensitive declarations | `content`, `applications` |
| `scheduling` | Availability, slot generation, bookings, caps, ICS | `applications`, `notifications` |
| `interviews` | Join tokens through `VideoProvider`, join events, scorecards | `scheduling`, `applications` |
| `training` | Course content, progress, assessment, attendance | `content`, `applications` |
| `payments` | `PaymentProvider` interface, stub and free provider, webhooks, receipts | `applications` |
| `tickets` | Tickets, messages, SLA, escalation, safety fast lane | `notifications`, `audit` |
| `notifications` | Templates, locale choice, `NotificationChannel` interface (email, push, SMS stub), dedupe | `content` |
| `content` | Assets, settings, email templates, translations | `storage`, `audit` |
| `admin` | Admin-facing read models and composite endpoints | most modules |
| `analytics` | Server-side events to PostHog, operations SQL views | none |
| `audit` | Append-only audit writer, hash chain, search | none |
| `storage` | Signed upload and download URLs, envelope encryption helpers | none |
| `common` | Guards, decorators, problem-details filter, request context, pino logging with PII redaction | none |

### 7.3 The state machine

- One transition table maps `(from_state, event, actor_role)` to `to_state` and required reason.
- `transition()` runs in one database transaction: lock the application row, check `version`, write the new state and history row, enqueue side effects through the pg-boss outbox.
- No module writes `applications.state` directly; a database trigger rejects any update that does not come from the transition function.
- Side effects (emails, push, scheduling unlocks, analytics) are jobs, so a failure never rolls back a legitimate state change.

### 7.3.1 Provider interfaces

| Interface | Phase 1 implementation | Later |
| --- | --- | --- |
| `VideoProvider` | Agora (RTC token builder) | Any WebRTC vendor |
| `PaymentProvider` | `FreeProvider` and `StubProvider` | Stripe, Paystack, Flutterwave, Razorpay |
| `NotificationChannel` | Resend email, OneSignal push, `SmsChannel` that throws "not enabled" | Twilio, MessageBird |
| `StorageProvider` | Supabase Storage | S3-compatible |
| `BotChallenge` | Cloudflare Turnstile | Any |

### 7.4 Scheduled jobs (pg-boss, in the worker)

| Job | Schedule | Purpose |
| --- | --- | --- |
| `reminder.interview` | 24 hours and 1 hour before | Email and push |
| `reminder.training` | 24 hours and 1 hour before | Email and push |
| `noshow.sweep` | Every 5 minutes | Mark no-shows 10 minutes after start; open reschedule or withdraw |
| `sla.sweep` | Every 5 minutes | Escalate tickets and queue items past SLA; page on safety |
| `purge.id-documents` | Daily | Delete files and null paths after 30 days |
| `purge.retention` | Weekly and monthly | Anonymise expired data |
| `account.deletion` | Daily | Finish deletion requests after the grace period |
| `intake.release` | Daily | Release waitlist applicants into open cohorts by capacity |
| `backup.verify` | Weekly | Restore the latest backup into a scratch database and run checks |
| `digest.admin` | Daily | Queue and SLA summary to Listener Admins |

### 7.5 Cross-cutting rules

- Configuration validated at boot; the process refuses to start on a missing secret.
- Logs never contain emails, names, tokens or document paths; request ids tie logs to audit rows.
- Every handler that reads PII writes an audit row in the same transaction.
- Outbound calls to vendors have timeouts, retries with backoff and a circuit breaker so a vendor outage cannot hang the API.
