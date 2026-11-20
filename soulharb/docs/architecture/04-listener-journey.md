# 4. Listener journey and state machine

The journey has 13 progress states and four side states, down from the 22 in the requirements, because reminders, attendance and receipts are events, not states.

[Diagram not exported: listener journey · 13 progress states, 4 side states]

Before Registered the visitor passes the video gate and receives a single-use completion token. Waitlisted applies when intake capacity is full, On hold covers a pending review or a safety concern, and a Rejected applicant who reapplies after the cool-down starts a new application rather than reopening the old one. Payment, if a fee exists, happens inside Training unlocked.

> Diagram: exported markdown omits embedded diagrams. See the source blueprint (docs/architecture/README.md) until a Mermaid version is added.
