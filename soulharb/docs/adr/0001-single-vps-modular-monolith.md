# ADR 0001: Single VPS with a modular monolith

- Status: Accepted
- Date: 2026-11-20

## Context

The MVP must be low-cost and operable by a small team. The existing VPS runs NGINX, Docker and Cloudflare.

## Decision

Run one NestJS API and one worker (shared code, jobs from a Postgres queue) plus two Next.js apps (web, admin) on the single VPS with Docker Compose. No AWS, Kubernetes, Redis or microservices initially.

## Consequences

Simple deploys and low cost. Capacity is gated by interviewers, not servers. Single point of failure on the VPS is accepted for the MVP; backups and a restore runbook are required. Revisit when Phase 2 traffic arrives.
