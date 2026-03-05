# PRD Clarifier Reference

## Prioritization Framework

Order clarification questions by impact. Ask in this priority:

1. **Critical path** — Requirements that block design, build, or launch. Unclear success criteria, missing core user flows, undefined MVP scope.
2. **High-ambiguity areas** — Sections that are vague, use jargon without definition, or have multiple plausible interpretations.
3. **Integration points** — APIs, third-party systems, auth, data sync. Who owns what, SLAs, failure behavior.
4. **Edge cases & error handling** — Offline behavior, validation rules, timeout/retry, partial failure, rollback.
5. **Non-functional requirements** — Performance (latency, throughput), security, scalability, accessibility. Often under-specified.
6. **User-journey gaps** — Onboarding, empty states, permissions, multi-tenant or role differences.

Within each tier, prefer questions that affect multiple requirements or that stakeholders are likely to disagree about.

---

## Question Quality Standards

Each clarification question must satisfy:

| Criterion | Requirement |
|-----------|--------------|
| **Specific** | Reference PRD sections, feature names, or user stories. Avoid "What about X?" without context. |
| **Actionable** | The answer should directly inform a requirement update (add, change, or remove text). |
| **Non-leading** | Do not embed the desired answer. Ask "What happens when the API is down?" not "Should we show a cached fallback when the API is down?" |
| **Singular** | One question per turn. Split compound questions into separate rounds. |
| **Contextual** | When possible, build on prior answers. E.g., "Given that only admins can approve, what should regular users see when they submit?" |

**Avoid**: Yes/no when an open answer would reveal more; questions about areas the PRD already defines clearly; hypotheticals that don't map to a concrete requirement.
