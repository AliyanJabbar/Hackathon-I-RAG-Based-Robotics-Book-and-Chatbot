<!--
Sync Impact Report:
Version change: 1.0.0 -> 1.0.1
List of modified principles: None
Added sections: None
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ pending
- .specify/templates/spec-template.md: ⚠ pending
- .specify/templates/tasks-template.md: ⚠ pending
- .specify/templates/commands/*.md: ⚠ pending
- README.md: ⚠ pending
- docs/quickstart.md: ⚠ pending
- CLAUDE.md: ⚠ pending
Follow-up TODOs: None
-->
# Robotics Constitution

## Core Principles

### I. Library-First
Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries.

### II. CLI Interface
Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### IV. Integration Testing
Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### V. Observability, Versioning & Simplicity
Text I/O ensures debuggability; Structured logging required; MAJOR.MINOR.BUILD format for versioning; Start simple, YAGNI principles.

## Additional Constraints

Adhere to Python coding standards (PEP8). Utilize modern software engineering practices, including object-oriented design and modular architecture. All external dependencies must be explicitly declared and managed.

## Development Workflow

All code changes require peer review before merging. Automated testing is mandatory for all new features and bug fixes. Continuous integration pipelines must pass before deployment.

## Governance

Constitution supersedes all other practices; Amendments require documentation, approval, migration plan. All PRs/reviews must verify compliance; Complexity must be justified; Use CLAUDE.md for runtime development guidance.

**Version**: 1.0.1 | **Ratified**: 2025-11-28 | **Last Amended**: 2025-11-30
