# 10. Docker, NGINX and deployment

Seven application containers and a tunnel run on one VPS behind NGINX. I recommend putting a Cloudflare Tunnel in front so the server has no open inbound web ports and the origin IP stops being a target; if you prefer the classic setup, the NGINX rules below also cover origin lock-down.

### 10.1 Docker architecture

| Container | Image | Exposed | Limits and notes |
| --- | --- | --- | --- |
| `cloudflared` (recommended) | Cloudflare official | None | Outbound tunnel only. Replaces open ports 80 and 443. |
| `nginx` | nginx stable-alpine | 443 (or internal only with the tunnel) | Terminates origin TLS, routes by host, rate limits, headers. |
| `web` | Next.js standalone build | Internal 3000 | 512 MB limit. Serves marketing and listener app. |
| `admin` | Next.js standalone build | Internal 3001 | 384 MB limit. Reachable only through Access. |
| `api` | NestJS | Internal 4000 | 768 MB limit. Stateless. |
| `worker` | NestJS standalone | None | 512 MB limit. pg-boss jobs. |
| `uptime` | Uptime Kuma | Internal, behind Access | Checks the public URLs and sends alerts. |
| `backup` | Small scheduled container | None | Nightly encrypted dump to off-site object storage. |

- Multi-stage builds, current Node LTS, non-root user, read-only root filesystem with a small `tmpfs`, `cap_drop: ALL`, `no-new-privileges`.
- One internal bridge network. Only `nginx` (or `cloudflared`) can reach the app containers; the apps reach the internet outbound only.
- Health checks on every service; `depends_on` waits for healthy.
- Secrets as files under `/run/secrets`, never in images, never in the repository. Encrypted secrets in Git with SOPS and age is acceptable.
- Images tagged with the commit hash and stored in the GitHub container registry. `latest` is never deployed.
- Log driver with size and file rotation. Errors go to Sentry; logs are reviewed through the host.
- Staging is a second compose project with its own Supabase project and its own hostnames behind Access, if the VPS has at least 8 GB of RAM; otherwise staging runs on a small separate instance.

### 10.2 NGINX architecture

| Host | Upstream | Special rules |
| --- | --- | --- |
| `soulharb.com`, `app.soulharb.com` | `web` | Cache `_next/static` as immutable; marketing pages cached at the edge; app routes never cached. |
| `admin.soulharb.com` | `admin` | Reject any request without a valid Cloudflare Access token header; no caching; stricter CSP. |
| `api.soulharb.com` | `api` | No caching; body limit 1 MB (uploads go straight to storage); CORS only for the app and admin origins. |

- Real client address taken from `CF-Connecting-IP`, trusted only from Cloudflare ranges. Ranges refreshed by a scheduled script.
- Origin accepts connections only from Cloudflare ranges, with Authenticated Origin Pulls verified, unless the tunnel is used.
- TLS 1.2 and 1.3 only; Cloudflare Origin CA certificate; SSL mode Full (strict); HSTS with preload after launch review.
- Headers: strict CSP with nonces (allowing only Agora, PostHog, OneSignal, Turnstile, Supabase and the video host), `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` that allows camera and microphone only on the interview route.
- `limit_req` zones for `/v1/gate`, `/v1/auth` and the API as a whole; `limit_conn` per address; short timeouts to blunt slow-client attacks.
- Access logs omit query strings and authorization headers, so tokens never reach disk.
- Custom error pages and a maintenance page that Cloudflare can serve if the origin is down.

### 10.3 Cloudflare settings

- Proxied DNS for the four hostnames, DNSSEC on, CAA records, email authentication records (SPF, DKIM, DMARC) for the Resend sending domain.
- Managed WAF rules, bot protection, rate-limiting rules on registration, login and gate endpoints, Turnstile on registration and ticket creation.
- Cloudflare Access applications for `admin`, `staging` and the Uptime Kuma host.

### 10.4 Environments and pipeline

1. **Local:** `docker compose` plus the Supabase CLI for a local database. Seed data for every state.
2. **Staging:** deploys automatically from `main`.
3. **Production:** deploys by manual approval of a tagged release.

The pipeline runs on every pull request: lint, type check, unit tests, API contract tests against the OpenAPI file, the permission-matrix test, a Playwright run of the happy path and the main failure paths, a dependency and image vulnerability scan, and a secret scan. On release it builds images, pushes them, applies database migrations, replaces containers one at a time after their health check passes, and runs smoke tests. Rollback is redeploying the previous image tag.

- **Migrations:** expand then contract, so the previous release still works against the new schema.
- **Zero downtime:** not required for the MVP; a brief restart is acceptable. Two `api` replicas behind NGINX is a Sprint 8 option.

### 10.5 Server hardening

- SSH by key only, root login off, access restricted to your office or VPN addresses (or through a private network tool), `fail2ban`, automatic security updates.
- Firewall with default deny. With the tunnel, no inbound web ports at all.
- A non-root `deploy` user with no shell access beyond what the pipeline needs.
- Disk, memory and CPU alerts at 80% usage; swap enabled; time sync on.
- Backups: Supabase daily backups plus a nightly encrypted `pg_dump` to off-site storage; restore tested weekly by the `backup.verify` job and reviewed monthly by a person.

### 10.6 Launch plan

| Stage | Entry | Exit |
| --- | --- | --- |
| Internal alpha | Staging stable; Sprint 6 complete | Team completes the whole journey on iOS, Android and desktop |
| Closed beta | Security review and counsel sign-off | 20 to 50 invited applicants, SLA met, no severity-1 defects for two weeks |
| Public launch with waitlist | Backup restore proven; on-call rota in place | Capacity matches interviewer hours; funnel dashboard live |
