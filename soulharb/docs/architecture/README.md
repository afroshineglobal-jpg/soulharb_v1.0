# SoulHarb Phase 1 architecture

Status: approved 2026-11-19. Source of truth for implementation.

Source blueprint (live doc): https://claude.ai/artifact/BTXvgFrb2xxqsq17Q1QwDY

The three diagrams (system architecture, listener journey, ERD) live only in the source blueprint for now.

The four documents describe a sound listener-onboarding product, but they disagree with each other on vendors, scope and the journey, and they leave the highest-risk areas (safety, ID data, payments and legal status of listeners) undefined. This blueprint resolves those conflicts, lists what is missing, and gives a build-ready design for a single-VPS MVP.

## Contents

1. [1. Review findings: conflicts, missing requirements and risks](./01-review-conflicts-and-risks.md)
2. [2. Review findings: scaling, database, flow, scope and alternatives](./02-review-scaling-db-flow-scope.md)
3. [3. System architecture](./03-system-architecture.md)
4. [4. Listener journey and state machine](./04-listener-journey.md)
5. [5. Database design and ERD](./05-database-design.md)
6. [6. API design](./06-api-design.md)
7. [7. Backend module design](./07-backend-modules.md)
8. [8. Frontend pages (listener PWA)](./08-frontend-pages.md)
9. [9. Admin portal and RBAC](./09-admin-portal-and-rbac.md)
10. [10. Docker, NGINX and deployment](./10-docker-nginx-deployment.md)
11. [11. Sprint plan](./11-sprint-plan.md)
12. [12. Production readiness checklist](./12-production-readiness.md)
13. [13. Improved questionnaire and scorecards](../content/13-questionnaire-and-scorecards.md)
14. [14. Improved homepage content](../content/14-homepage-content.md)
15. [15. Decisions needed before Sprint 1](./15-open-decisions.md)

Decisions are recorded in [../adr](../adr/README.md).
