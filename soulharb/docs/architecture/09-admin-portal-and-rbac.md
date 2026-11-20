# 9. Admin portal and RBAC

The admin portal is a separate Next.js app on `admin.soulharb.com`, behind Cloudflare Access, and every permission is checked on the server by permission code, not by role name.

### 9.1 Access model

- Invite-only. No self-registration. Invites expire in 48 hours.
- Mandatory TOTP enrolment on first login with ten one-time recovery codes. API requires the `aal2` claim.
- Session: 8-hour maximum, 30-minute idle timeout, admin cookie scoped to the admin host only.
- Cloudflare Access in front with an identity or IP rule, so the login page is not publicly reachable.
- Offboarding disables the account, revokes sessions and removes Access in one runbook step. Access reviewed quarterly.

### 9.2 Screens

| Screen | Used by | Key behaviour |
| --- | --- | --- |
| Role dashboard | All | Listener Admin: queues and SLA. Content Admin: content health. Platform Admin: funnel, capacity, incidents. |
| Applications | Listener, Platform | Filters by state, assignee, age; detail tabs for Overview, Profile, Questionnaire, Identity, Interview, Training, Timeline, Notes, Audit. |
| Questionnaire review | Listener | Answers beside the scoring rubric, auto-total, decision with reason, hold for ID. |
| ID review workbench | Listener, Platform | Documents hidden until "reveal" with a stated reason; watermark with admin email and time; zoom and rotate; no download; side-by-side with profile name and selfie; name-match control; rejection reason taxonomy. |
| Interview console | Listener, Platform | Today's schedule, join button, scorecard with autosave, decision and notes, red-flag escalation. |
| Training and cohorts | Listener | Attendance, progress, reschedule approvals, assessment results. |
| Final approval | Listener, Platform | Checklist of every gate with evidence; one-click approve; override with second approver. |
| Tickets | Listener, Platform | Queue, SLA due column, assignment, internal notes, escalate; safety tickets pinned with an alert banner. |
| Content | Content, Platform | Landing and training video with caption files, questionnaire builder with preview and locale status, email templates, translations. |
| Settings | Platform | Thresholds, fee and currency, SLA hours, reschedule caps, intake capacity, provider toggle. All changes audited with before and after. |
| Admin users | Platform | Invite, change role, disable, reset MFA. |
| Analytics | By role | Funnel with drop-off, time-to-approval, interview load, content completion. |
| Audit log | Platform | Search by actor, target, action, date; export. |

### 9.3 Permission matrix

This extends the matrix in the requirements with the capabilities it left out. Denied by default.

| Capability | Content Admin | Listener Admin | Platform Admin |
| --- | --- | --- | --- |
| Landing video, training content, translations, email templates | Yes | No | Yes |
| Questionnaire bank (create, publish) | Yes | No | Yes |
| View listener profile and contact details | No | Yes | Yes |
| View questionnaire answers and scoring | No | Yes | Yes |
| View sensitive declarations | No | Yes | Yes |
| Reveal government ID and selfie (reason required, alert on volume) | No | Yes | Yes |
| Decide on ID | No | Yes | Yes |
| Manage own availability | No | Yes | Yes |
| Conduct interview and submit scorecard | No | Yes | Yes |
| Approve or reject listener | No | Yes | Yes (override needs second approver) |
| Manage training schedule and approve reschedules | No | Yes | Yes |
| Verify payment status and issue refund | No | View only | Yes |
| Tickets | No | Assigned | All |
| View ticket internal notes | No | Yes | Yes |
| Escalate ticket, receive safety page | No | Yes | Yes |
| Analytics | Content only | Listener funnel | All |
| Change settings, fee, provider | No | No | Yes |
| Manage admin users | No | No | Yes |
| Read audit log | No | Own actions | All |
| Export listener data or delete a listener | No | No | Yes, with reason |

### 9.4 Enforcement

- Tables `roles`, `permissions` and `role_permissions` define the matrix. A guard reads the permission from the route decorator and checks it against the signed-in admin, with a short in-memory cache.
- Content Admin endpoints use response types with no personal data fields. The data never leaves the service, so a UI bug cannot leak it.
- The matrix is kept as a test fixture: an automated test calls every admin endpoint as every role and asserts the expected allow or deny.
- Separation of duty: the person who decides an ID cannot also give the final approval on the same application, unless a Platform Admin overrides with a second approver.
- Actions that need a typed reason: reveal ID, override, reject, delete data, change fee, reset another admin's MFA.
