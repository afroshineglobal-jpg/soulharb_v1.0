# 8. Frontend pages (listener PWA)

One Next.js app serves two hostnames: the marketing site on `soulharb.com` (statically generated) and the signed-in PWA on `app.soulharb.com`. The server decides which page a listener sees from the application state, so a listener can never open a step they have not unlocked.

### 8.1 Technical choices

- Next.js App Router, TypeScript strict, Tailwind with design tokens, `next-intl` for messages, Zod schemas shared with the API.
- Supabase client used only for sign-in and session; all other data comes from the API through TanStack Query.
- PWA with a service worker (Serwist): cached app shell, offline page, install prompt shown after the first completed step, not at registration.
- Agora Web SDK loaded only on the interview route, with a camera, microphone and network check before joining.
- WCAG 2.1 AA: captions and transcript for every video, visible focus, 44 px touch targets, reduced-motion support, form errors tied to fields.

### 8.2 Public pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page (content in section 14) |
| `/how-it-works` | The journey, timeline, what each step costs in time, fee policy |
| `/safety` | Verification, no-AI promise, crisis boundaries, what listeners are and are not |
| `/faq` | Eligibility, earnings statement, privacy, ID handling |
| `/legal/terms`, `/legal/privacy`, `/legal/code-of-conduct` | Versioned legal documents by locale |
| `/apply` | Video gate with captions, transcript and progress; returning visitors see a login link first |

### 8.3 Signed-in pages and the state that unlocks them

| Route | Shown when | Content |
| --- | --- | --- |
| `/register` | Gate complete | Email, password or magic link, age confirmation, consent checkboxes, bot challenge |
| `/verify-email` | Registered | Resend, change email, open mail app link |
| `/login`, `/forgot` | Any | Supabase sign-in and reset |
| `/app` | Always after sign-in | Status home: stepper, current step, next action, expected wait, who is acting, ticket shortcut |
| `/app/profile` | Email verified | Name, bio, photo, country, time zone, social links, payout country, language |
| `/app/questionnaire` | Profile complete | Sections with autosave, resume, progress, estimated time |
| `/app/identity` | Triage passed | Plain-language notice, consent, document type picker, camera or file capture, selfie, review status |
| `/app/waitlist` | Capacity full | Position, expected date, email opt-in |
| `/app/interview` | ID approved | Slot picker in the listener's time zone, reschedule and cancel, calendar file |
| `/app/interview/room` | Slot window open | Device check, join, reconnect, fallback to browser link on iOS issues |
| `/app/training` | Interview passed | Modules, captions, progress, assessment |
| `/app/training/session` | Live session required | Booking and join, if the training format includes a live part |
| `/app/payment` | Only if a fee is configured | Offer, checkout, receipt |
| `/app/approved` | Verified listener | Welcome, badge, agreement signed, what happens next |
| `/app/decision` | Rejected or withdrawn | Reason category, reapply date, appeal link, data deletion option |
| `/app/support`, `/app/support/new`, `/app/support/[id]` | Always | Tickets with category, attachments, status; a visible safety option |
| `/app/settings` | Always | Language, notification channels, install prompt, data export, deletion request |
| `/offline` | No network | Cached shell with retry and plain explanation |

### 8.4 Experience rules

1. One task per screen, with a persistent six-phase progress bar: Account, Profile, Questionnaire, Identity, Interview, Training.
2. Every waiting state says what is happening, how long it normally takes and what the listener can do meanwhile.
3. Everything autosaves and resumes on any device.
4. Plain language at roughly a grade-8 reading level; no clinical vocabulary.
5. Every failure shows what happened, whether data is safe, and the next action.
6. Interview day: a reminder email, a countdown on the home screen, and a join button that becomes active ten minutes before the slot.
7. iOS caveats are shown only to iOS users: push needs the app added to the home screen; camera access prompts differ in a home-screen app, so a "open in browser" fallback is always present.
