# 1. Review findings: conflicts, missing requirements and risks

The documents conflict on six points that must be settled before Sprint 1, and the biggest gaps are crisis safety, listener legal status, ID data handling and the training fee.

### 1.1 Conflicts between the documents

| # | Conflict | Source A | Source B | Resolution in this blueprint |
| --- | --- | --- | --- | --- |
| C1 | Phone verification | Requirements: phone OTP mandatory, SMS reminders | Architecture and project brief: no SMS in MVP | Drop phone OTP from MVP. Collect phone as optional and unverified. Keep a `NotificationChannel` interface so SMS plugs in later. Identity assurance comes from ID review plus live interview. |
| C2 | Video vendor | Requirements: Daily, Twilio, Whereby or Jitsi | Architecture: Agora | Agora, behind a `VideoProvider` interface. Tokens issued by NestJS only. |
| C3 | Journey states | Architecture: 13 steps, no phone step | Requirements: 22 states | Use the requirements machine, minus `PHONE_VERIFIED`, plus rejection, waitlist, withdrawal and appeal states (section 4). |
| C4 | Recording | Requirements: optional recording with consent | Architecture: recording deferred | Deferred. No recording in MVP. Schema has the consent type ready. |
| C5 | ID retention | Requirements: purge 30 to 90 days after approval | Not stated elsewhere | Fixed rule: purge 30 days after the final ID decision (approve or reject). Keep only a peppered hash and the decision. |
| C6 | Training format | Requirements: scheduler, 1-hour video and server-tracked completion | Journey: schedule then attend | Ambiguous: live session or watched video? Proposed: self-paced video modules plus an optional live Q&A. Needs your decision (section 15). |

### 1.2 Missing requirements

| Area | What is missing | Why it matters |
| --- | --- | --- |
| Crisis safety | Listener-facing protocol for a seeker in suicidal crisis or at risk of harm; mandatory reporting position; crisis line directory by country | Phase 2 is the real exposure, but listeners must be certified on it, and Phase 1 training must teach it. Without it the certificate means little. |
| Listener welfare | Secondary-trauma support, debrief channel, session limits | Listeners will hear distressing content; burnout drives churn and harm. |
| Rejection and appeals | Reject reasons shown to applicant, appeal path, reapplication cool-down | Rejection is the most common outcome; without a defined path it becomes a support-ticket flood. |
| Capacity control | Waitlist and intake throttling tied to interviewer hours | Admin interviews are the bottleneck. Unbounded signups create a backlog the SLA cannot meet. |
| Fraud and duplicates | Duplicate-ID detection, disposable-email block, multiple accounts per person | A listener who is rejected will simply re-register. |
| Selfie match | Selfie-with-ID step for manual face comparison | Manual KYC without it only proves someone has a document. |
| Account lifecycle | Withdraw application, delete account, data export, admin deactivation | Required by privacy law; also needed for abuse handling. |
| Interviewer operations | Availability management, round-robin, time zones, no-show by interviewer, backup interviewer | Requirements only cover the listener no-show. |
| Listener agreement | Contractor or volunteer terms, confidentiality agreement, no-AI-use clause, signed at final approval | The brand promise ("No AI") needs a contractual backing. |
| Payout groundwork | Payout country, tax residency and preferred method captured at profile stage | Phase 3 payouts will otherwise force a data migration and re-collection. |
| Operations | Backups with restore tests, monitoring, alerting, incident runbook, status page | Absent from all four documents. |
| Support content | Help centre, FAQ, rejection templates, email template library per locale | Ticketing needs canned responses to be workable. |
| Reference check | Optional reference contact | Cheap trust signal that does not need automated KYC. |

### 1.3 Business risks

| Risk | Severity | Detail and mitigation |
| --- | --- | --- |
| Charging listeners for training | High | Applicants pay to access a job that promises income, which resembles an advance-fee scam to regulators, app stores and applicants. Mitigate: make training free, or refund the fee as credit against first payouts, and state it plainly on the homepage. Decision needed. |
| Earnings claims | High | Homepage says "earn income" with no rate, volume guarantee or disclaimer. Add an honest statement: no guaranteed income, rates published before training, and the fee policy. |
| Chicken-and-egg supply | High | Certifying listeners before seekers exist gives no income and people leave. Mitigate: waitlist cohorts sized to expected Phase 2 demand, and a visible "what happens next" timeline. |
| Verification backlog | Medium | One interviewer handles roughly 10 to 12 thirty-minute interviews a day. Throttle intake to interviewer capacity. |
| Interview no-shows | Medium | Free interviews have high no-show rates. Reminders, a one-click reschedule, and a deposit are not needed; use the two-reschedule cap and auto-withdraw. |
| Positioning drift | Medium | "Empathetic listening" can be read as therapy. Keep copy and terms explicit that this is not counselling or medical care. |
| Vendor sprawl | Medium | Nine external services for an MVP is costly in integration time and in data-processing agreements. Section 2.2 trims this. |

### 1.4 Security risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Government ID and selfie exposure | Critical | Private storage bucket, envelope encryption with an application key, 5-minute signed URLs, watermarked admin view, every access logged, 30-day purge, no ID numbers stored. |
| Dual auth authority (Supabase Auth and NestJS) | High | One authority only: Supabase Auth issues JWTs, NestJS verifies them and never mints its own. Admin MFA enforced in the API, not just the UI. |
| NestJS service-role key bypasses RLS | High | Treat the service key as root. Keep it only in the API container, never in the frontend. Use RLS as a second layer on tables the browser can reach, and give the browser no direct table access at all. |
| Origin IP exposure | High | The VPS address appears in the project documents. Firewall the origin to Cloudflare ranges only, enable Authenticated Origin Pulls, and rotate the address if it has been shared widely. |
| Admin portal on a public hostname | High | Put `admin.soulharb.com` behind Cloudflare Access with an IP or identity rule in front of the app's own login and MFA. |
| Video gate bypass | Medium | The signed token check on the registration API is correct. The gate is a funnel step, not a security control; do not over-invest. |
| Device fingerprinting | Medium | Adds little security and creates consent obligations under privacy law. Drop it. Use a first-party cookie only. |
| Interview join link sharing | Medium | Agora tokens are per-user, per-channel, expire in 15 minutes after slot start, and are issued only inside the slot window. |
| Upload abuse | Medium | Type sniffing, size caps, image re-encoding to strip metadata, malware scan (ClamAV container) before an admin ever opens a file. |
| Single VPS compromise | Medium | Non-root containers, read-only filesystems where possible, SSH keys only, fail2ban, automatic security updates, secrets in a file mounted at runtime, not in images. |
| Admin insider abuse | Medium | Reason required to open an ID, two-person rule for overrides, immutable audit log, weekly access review. |

### 1.5 Legal and privacy concerns

The project owner is in Lagos, so the Nigeria Data Protection Act 2023 applies alongside GDPR for any EU or UK applicants. This is a list of issues for a lawyer, not legal advice.

- **Lawful basis for ID.** Consent is revocable and awkward for a mandatory step. Use contract necessity or legitimate interest, give a plain notice, and keep consent only for optional items (marketing, future recording).
- **Criminal-conviction question.** Self-declared convictions are special-category or sensitive data in several regimes, and asking is restricted by law in some countries. Store it in a separate restricted table, ask it only after ID approval, and have counsel confirm per launch country.
- **Cross-border transfers.** Data flows to Supabase, Agora, Resend, OneSignal, PostHog and Cal.com. Record each vendor's data region, sign each data processing agreement, and list them in the privacy policy.
- **Data protection impact assessment.** Identity documents plus emotional-fitness assessments make this a high-risk processing activity. Do one before launch.
- **Registration with the regulator.** Check whether the Nigerian data protection regulator requires registration or a data protection officer for this volume and data type.
- **Worker status.** Calling listeners "contractors" or "volunteers" does not decide their legal status. Get advice before Phase 3 payouts.
- **Therapy and health claims.** Homepage lines such as "reduce loneliness" and "calmer society" read as outcome claims. Rephrase as mission statements, not results.
- **"No AI" claim.** Make it enforceable: listener agreement clause, session-integrity checks in Phase 2, and no AI features used on listener content.
