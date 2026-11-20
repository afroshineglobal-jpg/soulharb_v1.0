# 15. Decisions needed before Sprint 1

> Note (2026-11-20): decisions 1 to 6 and the scheduler, training and phone choices are now locked; see ../adr/. This table keeps the original defaults for history.

Fifteen decisions shape the build; the first six block Sprint 1 or Sprint 2, and each has a default I will use if you do not choose.

| # | Decision | Options | My default | Blocks |
| --- | --- | --- | --- | --- |
| 1 | Launch countries and markets | Nigeria only, or several. The requirements mention Stripe and Razorpay, which suggests other markets. | Nigeria plus one more | Law, ID types, payments, Sprint 2 |
| 2 | Training fee | Free, refundable as payout credit, or paid | Free during beta | Sprint 5 |
| 3 | Training format | Live, self-paced video, or hybrid | Hybrid: self-paced modules plus optional live Q&A | Sprint 5 |
| 4 | Scheduler | Build inside the API, or Cal.com | Build inside the API | Sprint 4 |
| 5 | Phone verification | Defer (my recommendation) or keep with a future SMS vendor | Defer | Sprint 1 |
| 6 | Launch languages | English plus how many; who can review answers in each | English and one more | Sprint 1 |
| 7 | VPS size, region and Supabase plan and region | Minimum 4 GB RAM, Supabase paid plan, nearest region | As stated | Sprint 0 |
| 8 | Video hosting for gate and training | Cloudflare Stream, or Supabase Storage with Cloudflare cache | Cloudflare Stream | Sprint 1 |
| 9 | Interviewer headcount and weekly hours | Number of people and hours | 2 people, 10 hours each | Intake limits, Sprint 3 |
| 10 | Listener status and payout model | Volunteer, contractor, other; rate; payout timing | Decide before the homepage is published | Homepage, agreement |
| 11 | Author of the crisis protocol | A qualified professional or partner organisation | Engage one in Sprint 0 | Sprint 4 |
| 12 | Payment provider for later phases | Depends on your business country and listener countries; check availability for each | Keep the interface, choose later | Phase 2 |
| 13 | Recording | Defer, or define consent by country | Defer | Post-launch |
| 14 | Team size and start date | Engineers, designer, content producer | Two engineers, part-time designer | Plan dates |
| 15 | Brand and design assets | Logo, colours, typography, photography, who produces them | Provided by you; I design components from them | Sprint 0 |

### Assumptions I made

- Phase 1 volume is up to about 2,000 applicants a month, with 1 to 3 interviewers; the design will carry more, but capacity is gated by people, not servers.
- The VPS has at least 4 GB of RAM and runs Linux with Docker; I have not been able to inspect it.
- Vendor details such as plan limits and data regions change; each should be verified at purchase time.
- Nothing here is legal advice. Items marked for counsel need a qualified lawyer in each launch country.

### Suggested next step

Answer decisions 1 to 6, then I will turn this blueprint into the Sprint 0 and Sprint 1 task list, the migration plan for the first tables, and the OpenAPI outline, still with no code until you say go.
