# Implementation Plan: Unified Book Project (Robotics Docusaurus with RAG Chatbot, Auth, Personalization, and Translation)

**Branch**: `master` | **Date**: 2025-11-30 | **Spec**: `specs/master/spec.md`
**Input**: Feature specification from `/specs/master/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the development of a unified book project featuring Docusaurus for content, an integrated Retrieval-Augmented Generation (RAG) chatbot, user authentication with Better Auth, chapter-level content personalization, and Urdu translation. The primary goal is to deliver an interactive and personalized learning experience for Robotics content, leveraging AI for explanations and user adaptation. The technical approach involves extending Docusaurus with React components for UI, developing a FastAPI backend for RAG, personalization, and translation logic, and integrating with external services like OpenAI, Neon Postgres, Qdrant Cloud, and Better Auth.

## Technical Context

**Language/Version**: Python 3.11+ (backend - FastAPI, AI/NLP), TypeScript/JavaScript (Docusaurus frontend - React 18+).
**Primary Dependencies**:
*   **Frontend (Docusaurus)**:
    *   `framer-motion/react`, `react-icons`, `marked` (for ChatBot rendering).
    *   Better Auth SDK (for user authentication UI integration).
    *   Libraries for UI state management (e.g., Redux, Zustand) for personalization and translation toggles.
    *   Libraries for text translation (e.g., `i18next`, or direct API calls).
*   **Backend (Python - FastAPI)**:
    *   `uv` (for dependency management).
    *   FastAPI (for building RESTful APIs).
    *   OpenAI Agents/ChatKit SDKs (for RAG chatbot and LLM interactions).
    *   `qdrant-client` (for interacting with Qdrant vector database).
    *   `psycopg2-binary` or `asyncpg` (for Neon Serverless Postgres).
    *   Libraries for text processing, embedding generation, and potentially other AI/NLP tasks.
*   **External Services**:
    *   OpenAI API (for LLM and embedding generation).
    *   Neon Serverless Postgres (for RAG metadata, user profiles, personalization settings).
    *   Qdrant Cloud Free Tier (for vector storage of book content for RAG).
    *   Better Auth SaaS (for user authentication and management).
**Storage**: Neon Serverless Postgres (for RAG data metadata, user profiles including software/hardware background, personalization preferences, and potentially translation caches). Qdrant Cloud Free Tier (for vector embeddings of book content). Local storage/cookies for frontend session management.
**Testing**: Jest and React Testing Library for Docusaurus frontend components (unit and integration). Pytest for Python backend (unit, integration for FastAPI endpoints, RAG logic, database interactions). End-to-end testing (e.g., Playwright, Cypress) for critical user flows (signup, signin, chatbot interaction, personalization, translation).
**Target Platform**: Docusaurus frontend deployed to GitHub Pages. FastAPI backend deployed to a cloud platform (e.g., Render, Vercel, AWS Lambda/GCP Cloud Functions with API Gateway). Better Auth and Qdrant are SaaS solutions.
**Project Type**: A comprehensive web application integrating documentation, AI services, and user management. This is an advanced web application involving multiple distinct services and external integrations.
**Performance Goals**:
*   Chatbot Response Time: p95 < 2 seconds for basic queries.
*   RAG Query Latency: p95 < 3 seconds (including embedding lookup and LLM call).
*   Book Page Load Time: p95 < 1.5 seconds.
*   Authentication Latency: p95 < 1 second for login/signup.
*   Personalization/Translation Toggle Latency: Near instantaneous (< 500ms).
**Constraints**:
*   Qdrant Cloud Free Tier limitations (e.g., vector count, QPS).
*   Neon Serverless Postgres Free Tier limitations.
*   OpenAI API rate limits and cost considerations.
*   Security: Strict adherence to best practices for API keys, user data, and authentication (Better Auth integration).
*   Latency between frontend, backend, and external services.
*   Localization accuracy for Urdu translation.
*   Personalization must be user-driven and transparent.
**Scale/Scope**:
*   **Base Functionality (100 points)**: Docusaurus book deployment, RAG chatbot (with text selection), OpenAI Agents/ChatKit, FastAPI, Neon, Qdrant.
*   **Bonus 1 (50 points)**: Integration of Claude Code Subagents and Agent Skills for reusable intelligence within the book/chatbot context.
*   **Bonus 2 (50 points)**: Signup/Signin with Better Auth, collecting user software/hardware background for personalization.
*   **Bonus 3 (50 points)**: Chapter-level content personalization via button toggle for logged-in users.
*   **Bonus 4 (50 points)**: Chapter-level Urdu translation via button toggle for logged-in users.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the `Robotics Constitution` (Version 1.0.1):

-   **I. Library-First**: Adhered to. Both frontend and backend components (ChatBot, Auth UI, Personalization/Translation modules, RAG API, etc.) will be developed as self-contained, independently testable units.
-   **II. CLI Interface**: The primary interfaces are web-based (Docusaurus UI, FastAPI HTTP API). The principle of clear input/output protocols is maintained. Integration with external APIs (OpenAI, Qdrant, Better Auth) also follows well-defined contracts.
-   **III. Test-First (NON-NEGOTIABLE)**: This is CRITICAL. A rigorous test-first approach will be enforced for all components. This plan explicitly mandates specific testing frameworks (Jest, React Testing Library, Pytest) and coverage for unit, integration, and E2E tests for the complex interactions involved (RAG, Auth, Personalization, Translation).
-   **IV. Integration Testing**: Essential for this project given the numerous integrations (Docusaurus-Backend, Backend-OpenAI, Backend-Qdrant, Backend-Neon, Frontend-BetterAuth SDK). Comprehensive integration tests will be designed to cover the entire data flow and user experience across these services.
-   **V. Observability, Versioning & Simplicity**: Structured logging will be implemented across the backend for monitoring RAG queries, user interactions, and API performance. Versioning for both frontend and backend APIs will follow MAJOR.MINOR.BUILD. Simplicity will be a continuous focus, carefully managing the complexity introduced by multiple integrations and bonus features, prioritizing core functionality over premature optimization.

## Project Structure

### Documentation (this feature)

```text
specs/master/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/              # FastAPI endpoints for RAG, personalization, translation, and user data handling.
│   ├── services/         # Core logic for RAG, LLM orchestration, Qdrant interaction, Neon DB access.
│   ├── models/           # Pydantic models for request/response, database schemas, RAG data.
│   ├── utils/            # Backend utility functions (e.g., text processing, embedding generation).
│   └── auth/             # Integration logic with Better Auth for user management.
└── tests/                # Pytest unit, integration, and E2E tests for backend services.

docusaurus/
├── src/
│   ├── components/       # Frontend React components: ChatBot, Auth forms, Personalization UI, Translation toggle.
│   │   └── ChatBot/        # Chatbot UI, message display, input handling.
│   │   └── Auth/           # Signup/Signin forms, user profile display.
│   │   └── Personalization/ # UI for personalizing content.
│   │   └── Translation/    # UI for language translation.
│   ├── pages/            # Custom Docusaurus pages (e.g., User Dashboard, specific auth pages).
│   ├── theme/            # Docusaurus theme overrides for custom UI elements (e.g., chat widget, header buttons).
│   ├── hooks/            # React hooks for state management and API calls.
│   ├── contexts/         # React contexts for user authentication, personalization settings, translation state.
│   └── utils/            # Frontend utility functions (e.g., sanitizeInput.ts, API clients, translation helpers).
├── docs/                 # Robotics course documentation (markdown files).
├── static/               # Static assets (images, CSS, JS).
└── tests/                # Jest/React Testing Library for frontend components and user flows.
```

**Structure Decision**: The project will maintain a clear separation between the Docusaurus frontend and a new Python FastAPI backend. The `backend` will handle all AI logic (RAG, LLM), database interactions (Neon, Qdrant), and user management (Better Auth integration). The `docusaurus` project will be extended with React components and contexts to provide the interactive chatbot, authentication UI, personalization controls, and translation features. This expanded structure accommodates the new requirements for a complex, integrated web application while maintaining modularity.