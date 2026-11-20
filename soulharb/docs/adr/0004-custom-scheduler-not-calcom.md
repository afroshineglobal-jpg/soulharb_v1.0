# ADR 0004: Build the interview scheduler in the API, not Cal.com

- Status: Accepted
- Date: 2026-11-20

## Context

The original stack listed Cal.com. Interview capacity, hold and reschedule rules, reminders and audit logging are core to the journey.

## Decision

Build scheduling inside the API (availability, booking lifecycle, reminders via the worker). Do not use Cal.com.

## Consequences

More build effort in Sprint 4, but booking state stays in our database and audit log, with no extra vendor or sync layer.
