# 11. Sprint plan

The plan is a Sprint 0 plus eight two-week sprints, about 18 weeks, assuming two full-time engineers and a part-time designer. With one engineer, expect roughly double. The order changes from the documents: questionnaire before ID, and Sprint 0 is added for foundations.

### 11.1 Sprints

| Sprint | Goal | Scope | Exit criteria |
| --- | --- | --- | --- |
| 0 (weeks 1-2) | Foundations | Repository, CI, Docker images, VPS hardening, Cloudflare, Supabase projects (staging and production), design tokens, i18n skeleton, vendor accounts, legal drafting started | Hello-world deploys to staging through the pipeline; backups run; every vendor has a signed data processing agreement or a date for it |
| 1 | Identity and gate | Gate sessions and tokens, registration, email verification, login, admin invite, admin MFA, Cloudflare Access, base audit writer, `applications` and the state machine skeleton | A new visitor completes gate, registration and verification on mobile; the gate cannot be bypassed by calling the API directly; an admin cannot sign in without MFA |
| 2 | Profile and questionnaire | Consents and legal documents, profile and photo, questionnaire versions, autosave, auto-scoring, reviewer screen, triage state, rejection templates | Content Admin publishes a questionnaire; a listener completes it and a Listener Admin triages it |
| 3 | Identity verification | ID and selfie upload with re-encoding and encryption, review workbench, duplicate fingerprints, access logging, 30-day purge, waitlist and cohort intake | Purge job proven on test data; every document view appears in the audit log; a second application with the same ID is flagged |
| 4 | Interview | Availability, slot generation, bookings and caps, reminders, Agora token service, room page with device check, no-show sweeper, scorecard | A full interview runs on desktop, Android and iOS; reschedule cap and no-show paths behave as specified |
| 5 | Training | Course, modules, server-tracked progress, assessment, live session booking if required, attendance, payment interface with free and stub providers | Completion cannot be forged by replaying client calls; a listener who skips content cannot finish |
| 6 | Approval and support | Final approval, agreement signature, welcome and badge, public profile view, tickets, SLA sweeper, safety fast lane and on-call alert | A safety report pages on-call within a minute; final approval refuses any application missing a gate |
| 7 | Admin hardening and analytics | Permission-matrix test suite, audit search and export, settings screens, funnel and operations views, PostHog events, account deletion and export | Every endpoint passes the role matrix test; deletion request completes end to end |
| 8 | Release hardening | PWA polish, accessibility audit, load test, penetration test, backup restore drill, runbooks, closed beta | No open critical or high findings; restore drill under two hours; beta cohort onboarded |

### 11.2 Work that is not code and sits on the critical path

| Workstream | Why it can delay launch | Needed by |
| --- | --- | --- |
| Training content (video, assessment, handouts) | Producing one hour of good training takes longer than the code that plays it | Sprint 5 |
| Landing video and captions | Required for the gate | Sprint 1 |
| Crisis and safety protocol | Written or reviewed by a qualified professional; training and tickets depend on it | Sprint 4 |
| Legal: terms, privacy notice, code of conduct, listener agreement, impact assessment | Counsel turnaround time | Sprint 2 |
| Questionnaire and rubric review | A psychologist or experienced trainer should validate it and pilot it | Sprint 2 |
| Interviewer recruitment and calibration | Capacity depends on it | Sprint 3 |
| Support content: help articles, rejection and escalation templates | Ticketing needs them | Sprint 6 |
