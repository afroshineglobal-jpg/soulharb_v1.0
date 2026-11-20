# ADR 0005: No SMS or phone OTP in the MVP

- Status: Accepted
- Date: 2026-11-20

## Context

The requirements asked for mandatory phone verification, which conflicts with the no-SMS constraint.

## Decision

Store the phone number only; do not verify it. Put SMS behind a provider interface so a vendor can be added later.

## Consequences

Weaker identity signal in Phase 1, covered by ID review and interview. Future SMS or OTP can be added without schema changes.
