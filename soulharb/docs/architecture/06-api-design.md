# 6. API design

One REST API at `api.soulharb.com/v1`, JSON over HTTPS, documented by generated OpenAPI. Listener endpoints and admin endpoints share the service but not the guards.

### 6.1 Conventions

- **Auth:** `Authorization: Bearer <Supabase JWT>`. NestJS verifies signature, expiry and audience. Admin routes also require the `aal2` claim (MFA completed) and a matching row in `admin_users`.
- **Sign-up:** disabled on the Supabase client. Registration goes through `POST /v1/auth/register`, which checks the gate token, the bot challenge, age and consents before creating the user server-side.
- **Errors:** RFC 7807 problem details with a stable `code`, plus a `requestId` that is also in the logs.
- **Idempotency:** `Idempotency-Key` header required on payment, booking and transition calls.
- **Concurrency:** transitions send `If-Match` with the application `version`.
- **Pagination:** cursor-based, `limit` capped at 100.
- **Versioning:** path prefix; additive changes only inside a version.

### 6.2 Endpoint groups

| Group | Endpoints | Notes |
| --- | --- | --- |
| Gate (public) | `POST /gate/sessions`, `POST /gate/sessions/{id}/progress`, `POST /gate/sessions/{id}/complete` | Start returns a signed session token. Progress is a heartbeat. Complete returns a single-use completion token valid 30 minutes. |
| Public config | `GET /public/config` | Video asset URL, captions, threshold, supported locales, legal document versions. Cached at the edge. |
| Auth | `POST /auth/register`, `POST /auth/resend-verification` | Login, refresh, magic link and MFA use the Supabase client directly. |
| Me | `GET /me`, `PATCH /me`, `POST /me/deletion-request`, `GET /me/export` | Export is an asynchronous job that emails a time-limited link. |
| Application | `GET /applications/current`, `POST /applications`, `POST /applications/current/withdraw`, `GET /applications/current/timeline` | The current call returns state, next action, expected wait and the acting party. |
| Legal | `GET /legal/{type}`, `POST /consents` | Each consent stores document version and purpose. |
| Profile | `GET /profile`, `PUT /profile`, `POST /profile/photo/upload-url`, `POST /profile/photo/confirm` | Photo goes straight to storage through a signed URL, then is validated and re-encoded. |
| ID verification | `POST /verification/documents/upload-url`, `POST /verification/documents/{id}/confirm`, `GET /verification/status` | Only images, size capped. Listeners cannot download documents after upload. |
| Questionnaire | `GET /questionnaire/current`, `PUT /questionnaire/answers`, `POST /questionnaire/submit` | Autosave on every field. Locale from the application. |
| Scheduling | `GET /scheduling/slots`, `POST /scheduling/bookings`, `POST /scheduling/bookings/{id}/reschedule`, `DELETE /scheduling/bookings/{id}`, `GET /scheduling/bookings/{id}/calendar.ics` | Slots exist only for the booking kind the state allows. The cap is enforced here. |
| Interview | `POST /interviews/{id}/join-token`, `POST /interviews/{id}/events` | Token is issued only inside the slot window. Events record join and leave. |
| Training | `GET /training/course`, `POST /training/modules/{id}/heartbeat`, `POST /training/modules/{id}/complete`, `POST /training/assessment/attempts` | Server computes completion from heartbeats. |
| Payments | `GET /payments/offer`, `POST /payments/checkout`, `POST /webhooks/payments/{provider}`, `GET /payments/{id}/receipt` | Returns a free offer while the fee is zero. Webhooks verify signatures and deduplicate by event id. |
| Tickets | `POST /tickets`, `GET /tickets`, `GET /tickets/{id}`, `POST /tickets/{id}/messages`, `POST /tickets/{id}/close`, `POST /safety/report` | The safety report skips the queue, creates a P1 ticket and pages on-call. |
| Notifications | `POST /notifications/push/subscribe`, `GET /notification-preferences`, `PATCH /notification-preferences` | Email is the system of record; push is a convenience. |
| Webhooks | Resend delivery events, optional Agora channel events | Signature verified, replay window enforced. |
| Health | `GET /health/live`, `GET /health/ready` | Reachable only from inside the Docker network. |

### 6.3 Admin endpoints (`/admin/...`)

| Group | Endpoints | Minimum role |
| --- | --- | --- |
| Applications | `GET /applications`, `GET /applications/{id}`, `POST /applications/{id}/assign`, `POST /applications/{id}/transition` | Listener Admin |
| Questionnaire review | `GET /questionnaire-reviews/queue`, `POST /applications/{id}/questionnaire-review` | Listener Admin |
| ID review | `GET /verification/queue`, `POST /verification/documents/{id}/view-url`, `POST /verification/documents/{id}/decision` | Listener Admin; the view URL requires a stated reason and lasts 5 minutes |
| Interviews | `GET /interviews/today`, `POST /interviews/{id}/join-token`, `POST /interviews/{id}/scorecard`, `PUT /availability` | Listener Admin |
| Training | `GET /training/attendance`, `POST /bookings/{id}/approve-reschedule` | Listener Admin |
| Approval | `POST /applications/{id}/final-approval`, `POST /applications/{id}/override` | Listener Admin; override needs Platform Admin plus a second approver |
| Content | `/content/assets`, `/questionnaires`, `/translations`, `/email-templates` | Content Admin |
| Settings | `/settings`, `/payment-provider` | Platform Admin |
| Admin users | `POST /users/invite`, `PATCH /users/{id}/role`, `POST /users/{id}/disable`, `POST /users/{id}/reset-mfa` | Platform Admin |
| Tickets | `/tickets`, `POST /tickets/{id}/assign`, `POST /tickets/{id}/escalate` | Listener Admin, all tickets for Platform Admin |
| Analytics | `GET /analytics/funnel`, `GET /analytics/operations`, `GET /analytics/content` | Scoped by role |
| Audit | `GET /audit-log`, `POST /audit-log/export` | Platform Admin |

### 6.4 Rate limits

| Endpoint | Limit | Layer |
| --- | --- | --- |
| Gate start | 10 per minute per IP | Cloudflare and NestJS |
| Register and resend verification | 5 per hour per IP and per email | Cloudflare, NestJS and bot challenge |
| Login attempts | Supabase configured limits | Supabase |
| Upload URLs | 10 per hour per user | NestJS |
| Training heartbeat | 1 per 10 seconds per module | NestJS |
| Join token | 5 per minute per user | NestJS |
| Tickets | 10 per day per user | NestJS |
| Admin document view URL | 30 per hour per admin, alert above 20 | NestJS |
