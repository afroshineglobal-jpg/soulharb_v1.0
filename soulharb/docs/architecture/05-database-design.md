# 5. Database design and ERD

The model has 12 domains and about 50 tables in Postgres on Supabase, with the application (not the user) as the unit of the journey. Identifiers are UUIDv7, all times are `timestamptz` in UTC, and the browser has no direct table access.

### 5.1 Principles

- Row Level Security is enabled on every table with no policies for the browser role (default deny). All access goes through NestJS.
- State changes happen in one transaction: update `applications.state`, insert the history row, enqueue notification jobs.
- Optimistic locking on `applications.version` so two admins cannot decide the same case.
- Log tables are append-only; `UPDATE` and `DELETE` are revoked for the application role.
- Soft delete only where a grace period exists (account deletion); otherwise hard delete or anonymise by job.

### 5.2 Tables by domain

| Domain | Tables | Key columns and rules |
| --- | --- | --- |
| Identity | `users`, `admin_users`, `legal_documents`, `user_consents` | `users.id` equals the Supabase auth user id. `admin_users(user_id, role, mfa_enrolled_at, disabled_at)`. `legal_documents(type, version, locale, effective_at)`. `user_consents(user_id, document_id, purpose, granted_at, withdrawn_at, ip_hash)`. |
| Application | `applications`, `application_state_history`, `cohorts`, `waitlist_entries` | `applications(user_id, state, version, cohort_id, source, locale, decided_at, rejection_code, reapply_after)`. One active application per user (partial unique index). History: `from_state, to_state, actor_type, actor_id, reason, metadata`. |
| Profile | `listener_profiles` | `legal_name`, `display_name`, `country`, `timezone`, `bio`, `photo_path`, `social_links` (validated URLs), unverified `phone_e164`, `payout_country`. |
| ID verification | `verification_documents`, `id_reviews`, `id_fingerprints` | Documents: `kind` (id front, id back, selfie), `storage_path`, `key_id`, `sha256`, `status`, `purge_after`, `purged_at`. Reviews: `decision`, `reason_code`, `name_match`. Fingerprints: keyed hash, unique, survives purge, used only for duplicate detection. |
| Questionnaire | `questionnaires`, `questionnaire_versions`, `questions`, `question_translations`, `answers`, `questionnaire_reviews`, `sensitive_declarations` | A published version is immutable. `answers(application_id, question_id, value jsonb)`. Reviews hold per-category scores, total, decision. Declarations are readable only by Listener Admin and Platform Admin, never by Content Admin. |
| Scheduling | `availability_rules`, `availability_exceptions`, `bookings`, `interviews`, `interview_scorecards` | `bookings(kind, application_id, admin_id, starts_at, ends_at, status, reschedule_count)` with a unique partial index on `(admin_id, starts_at)` for active bookings. Scorecards are immutable once submitted; corrections are new rows that supersede. |
| Training | `training_courses`, `training_modules`, `training_progress`, `training_assessments`, `assessment_attempts` | Progress stores `max_position_seconds`, `watched_seconds`, `last_heartbeat_at`, `completed_at`. Completion is computed by the server from heartbeats, never trusted from the client. |
| Payments | `payments`, `payment_events`, `refunds` | `payments(application_id, provider, provider_ref, amount_minor, currency, status, idempotency_key)`. Events are deduplicated by provider event id. Unused while training is free, but the tables ship. |
| Support | `tickets`, `ticket_messages`, `ticket_events`, `safety_flags` | `tickets(category, severity, status, assignee_id, sla_due_at, escalation_level)`. Internal notes flagged on messages. |
| Content and config | `content_assets`, `site_settings`, `email_templates`, `translations` | Settings include video completion threshold, training fee, SLA hours, reschedule caps. Every change is audited. |
| Notifications | `notifications`, `push_subscriptions`, `notification_preferences` | `dedupe_key` unique so a retried job never sends twice. |
| Audit | `audit_log` | `actor_type, actor_id, action, target_type, target_id, before, after, reason, ip, user_agent, request_id, prev_hash, row_hash`. |
| Phase 2 staging | `public_listener_profiles` (view) | Display name, photo, public bio, languages, topics, verified date. No PII, no legal name, no country. |

### 5.3 Indexes and constraints that matter

- Partial unique: one active application per user; one active booking per interviewer slot; one non-purged document per kind per application.
- Foreign keys everywhere, `ON DELETE RESTRICT` on anything audited.
- Check constraints on state values, document kinds and reschedule counts.
- Composite indexes: `applications(state, updated_at)` for admin queues; `bookings(admin_id, starts_at)`; `tickets(status, sla_due_at)`; `notifications(status, scheduled_for)`.

### 5.4 Retention defaults (confirm with counsel)

| Data | Default retention | Mechanism |
| --- | --- | --- |
| ID images and selfie | 30 days after the final ID decision | Daily purge job; deletes the file and nulls the path; keeps the keyed hash and decision |
| Questionnaire answers and scorecards, rejected | 12 months, then anonymised | Monthly job |
| Same data, approved listeners | Life of the account plus 12 months | Tied to account deletion |
| Sensitive declarations | Same as the application, with narrower access | Same job |
| Audit log | At least 24 months | Archived, never edited |
| Tickets | 24 months | Monthly job |
| Notification log | 90 days | Weekly job |
| Deleted accounts | 30-day grace, then anonymise | Daily job |

### 5.5 ERD

[Diagram not exported: entity relationships · core tables]

A user owns many applications, and the application, not the user, owns the answers, documents, bookings, training progress, payments and tickets, so a reapplication never mixes with an earlier attempt. The `audit_log` table sits outside this tree and is written by every module.

> Diagram: exported markdown omits embedded diagrams. See the source blueprint (docs/architecture/README.md) until a Mermaid version is added.
