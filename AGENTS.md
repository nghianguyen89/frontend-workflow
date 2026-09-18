# Repository Instructions

These rules supplement the inherited instructions. Keep changes scoped and do not alter application code or configuration unless the task requires it.

## Troubleshooting Knowledge Retention Gate

Before substantial investigation of a bug or unexpected behavior, search [docs/PROJECT_TROUBLESHOOTING.md](docs/PROJECT_TROUBLESHOOTING.md). Reuse applicable verified knowledge, but confirm it still matches the current codebase.

For debugging, bug fixes, non-obvious build/lint/type/test failures, integration/authentication/environment problems, library quirks, performance issues, races, or lifecycle/state issues, completion is:

`Investigate -> confirm root cause -> implement -> run relevant checks -> review/validate -> retention gate -> update KB when warranted -> complete`

After verification, update the KB only when the root cause is non-obvious, investigation was significant, recurrence is plausible, the issue is repository-specific, an important implementation rule was confirmed, or it would materially reduce future investigation. Do not document typos, routine work, temporary output, one-off errors, or suspected/unverified causes.

Before adding an entry, search for the same root cause and improve the existing entry instead of creating a chronological duplicate. Keep entries compact: problem, root cause, fix, prevention. Never store credentials, tokens, private keys, personal information, or secret values.

Current verified code and checks take precedence over old KB entries. Correct or remove obsolete information when architecture changes.

## Troubleshooting Roles

When multiple agents are used:

- Investigator: report symptoms, confirmed root cause, affected areas, and reusable lessons.
- Implementer: fix the verified cause; do not present a hypothesis as fact.
- Reviewer/validator: confirm the fix, relevant checks, root-cause claim, and proposed KB wording.
- Coordinator: run the retention gate, merge duplicates, update the KB when warranted, and report `Troubleshooting KB: updated`.

For normal feature work, do not add retention overhead unless troubleshooting produced durable knowledge.
