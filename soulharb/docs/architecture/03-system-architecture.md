# 3. System architecture

The system is one VPS running a modular monolith (an API and a worker) and two web apps, with Supabase holding all data and vendors handling video, email, push and analytics.

```mermaid
flowchart TB
  LB["Listener and applicant browser or PWA"] --> CF
  AB["Admin, content and interviewer browsers"] --> CF
  CF["Cloudflare<br/>DNS, WAF and rate limits, Turnstile,<br/>Access on the admin host, tunnel"]
  subgraph VPS["VPS: one Docker network, no published ports"]
    CD["cloudflared<br/>outbound tunnel"]
    NG["NGINX<br/>routes by host, sets headers and limits"]
    WEB["web<br/>Next.js listener app"]
    ADM["admin<br/>Next.js admin app"]
    API["api<br/>NestJS REST API"]
    WK["worker<br/>scheduled jobs"]
    UP["uptime monitor"]
    BK["backup job"]
    CD --> NG
    NG --> WEB
    NG --> ADM
    NG --> API
    API --> WK
  end
  CF -- "tunnel, no open inbound ports" --> CD
  subgraph EXT["Outside the VPS"]
    SB["Supabase<br/>Postgres, Auth, Storage"]
    AG["Agora<br/>video rooms"]
    CO["Resend and OneSignal<br/>email and push"]
    PH["PostHog<br/>product events"]
    ST["Cloudflare Stream<br/>gate and training video"]
    OS["Off-site storage<br/>encrypted nightly backups"]
  end
  API -- "api and worker call out" --> EXT
  WK --> EXT
  style API stroke-width:3px
```

The highlighted `api` holds every business rule; `web` and `admin` only render, and `worker` shares the API's code and runs the timed jobs from a queue in Postgres. Browsers also talk directly to Supabase Auth for sign-in and to Agora for video, using short-lived tokens the API issues. Nothing on the VPS is reachable from the internet except through Cloudflare.
