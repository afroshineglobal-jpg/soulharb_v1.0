# ADR 0002: Supabase for database, auth and storage

- Status: Accepted
- Date: 2026-11-20

## Context

We need Postgres, authentication and file storage without operating them ourselves.

## Decision

Use Supabase for Postgres (with RLS), Auth and Storage. The API holds all business rules; web and admin only render. Browsers talk to Supabase Auth directly and use short-lived tokens issued by the API for other vendors.

## Consequences

Less infrastructure to run. Vendor lock-in is limited by keeping plain SQL migrations in supabase/migrations and business logic in the API. Plan limits and data region must be verified at purchase.
