
# Implementation Plan: Content Customization System

## Phase 1: Backend Authentication & Data Model
**Goal:** Ensure users have profiles with experience levels and can authenticate securely.
- [x] Extend `User` model in SQLModel to include `software_experience` and `hardware_experience` (Enum: beginner, intermediate, advanced).
- [x] Implement Auth endpoints compatible with React Context:
  - `/register`: Accepts new fields.
  - `/token`: Generates JWT.
  - `/refresh`: Handles long-lived sessions.
  - `/users/me`: Returns full user profile.

## Phase 2: Backend AI Customization Logic
**Goal:** Create the intelligence to rewrite text.
- [x] Define `CustomizeTextRequest` Pydantic model.
- [x] Configure a specific `Agent` for customization.
  - **System Prompt:** Define strict guidelines for rewriting based on input variables (e.g., "If beginner, use analogies").
  - **Tools:** Equip with `retrieve_data` (RAG) to ensure factual accuracy during rewriting.
- [x] Create `POST /customize_text` endpoint to run the Agent.

## Phase 3: Frontend Integration
**Goal:** Connect the UI to the Logic.
- [x] Setup `AuthContext` to manage token storage, axios interceptors (for refresh), and user state.
- [x] Update `ChapterTranslator` component:
  - Import `useAuth`.
  - Add "Customize" button.
  - Add logic to extract text from `children`.
  - Handle API states (Loading, Error, Success).
  - Toggle view logic (Original vs. Translated vs. Customized).

## Phase 4: UI/UX Refinement
**Goal:** Ensure a smooth user experience.
- [x] styling for the Customize button (distinct from Translate).
- [x] Visual indicators for "Customized" state (e.g., border, icon).
- [x] Error handling for unauthenticated users (Prompt to login).