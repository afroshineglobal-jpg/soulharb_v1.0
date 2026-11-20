# ADR 0009: Journey modelled as 13 progress states plus 4 side states

- Status: Accepted
- Date: 2026-11-20

## Context

Requirements listed 22 states, many of which are events (reminders, attendance, receipts).

## Decision

Model 13 progress states plus 4 side states, including Waitlisted, On hold and Rejected, as defined in docs/architecture/04-listener-journey.md. Events go to the audit log.

## Consequences

Smaller state machine and simpler admin tooling. The questionnaire comes before ID upload so applicants who would be rejected never submit an ID.
