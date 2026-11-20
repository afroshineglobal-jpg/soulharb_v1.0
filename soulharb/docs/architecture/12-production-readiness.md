# 12. Production readiness checklist

Launch is gated on every item below, and each item has a named owner and evidence.

### Security

- [ ] Origin IP not reachable except through Cloudflare or the tunnel; verified from outside
- [ ] Admin host behind Cloudflare Access; MFA enforced in the API and tested
- [ ] Service-role key present only in the API and worker containers
- [ ] ID and selfie encrypted, signed URLs expire in 5 minutes, access logged, watermark on admin view
- [ ] Uploads accepted only as images, re-encoded, size capped
- [ ] Secrets rotated since development; none in the repository or images
- [ ] Dependency, image and secret scans pass in CI
- [ ] External penetration test completed; no open critical or high findings
- [ ] Permission-matrix test passes for every admin endpoint and role

### Privacy and legal

- [ ] Terms, privacy notice, code of conduct and listener agreement published and versioned
- [ ] Data protection impact assessment completed; regulator registration question answered
- [ ] Data processing agreements signed with every vendor; regions recorded
- [ ] Retention jobs run in staging and logs show correct deletions
- [ ] Account deletion and data export work end to end
- [ ] Cookie and analytics consent behaves correctly in each launch region
- [ ] Counsel has approved the criminal-history question per launch country
- [ ] Homepage claims reviewed (earnings, outcomes, "no AI")

### Safety and trust

- [ ] Crisis protocol approved and included in training
- [ ] Safety fast lane tested: a P1 report reaches on-call within a minute, on a weekend
- [ ] On-call rota, escalation contacts and a response script exist
- [ ] Rejection, appeal and reapplication paths tested
- [ ] Interviewers calibrated; scorecard double-scored on a sample

### Reliability and data

- [ ] Nightly off-site backup running; restore drill completed in under two hours
- [ ] Migrations are backward compatible; rollback rehearsed
- [ ] Container memory limits set; load test at three times expected peak passes
- [ ] Health checks, restart policies and log rotation in place
- [ ] Disk, memory, CPU, certificate expiry and job-queue depth alerts configured
- [ ] Status page or status message process ready

### Quality

- [ ] Happy path and main failure paths covered by automated browser tests
- [ ] Tested on current iOS Safari, Android Chrome and desktop browsers, including the interview room and installed-PWA mode
- [ ] Accessibility audit against WCAG 2.1 AA passed, including captions and keyboard use
- [ ] Performance budget met: largest contentful paint under 2.5 seconds on a mid-range phone over 4G
- [ ] Email deliverability verified (SPF, DKIM, DMARC) with test sends to major providers

### Operations

- [ ] Runbooks: deploy, rollback, restore, rotate secrets, vendor outage, data breach, safety incident
- [ ] Breach notification procedure and contacts written, including regulator timelines
- [ ] Admin onboarding and offboarding checklists in use; quarterly access review scheduled
- [ ] Interviewer availability published for the first four weeks
- [ ] Support inbox, canned responses and escalation matrix live
- [ ] Closed beta completed with SLAs met and defects triaged
