# ADR 0006: Government ID retention of 30 days after the final ID decision

- Status: Accepted
- Date: 2026-11-20

## Context

Requirements gave a 30 to 90 day range for ID documents. Manual ID review is the only KYC in Phase 1.

## Decision

A daily purge job deletes ID images and selfie 30 days after the final ID decision (approve or reject), nulls the path, and keeps the keyed hash and the decision.

## Consequences

Reduces privacy exposure. Counsel in each launch country must confirm the period before launch.
