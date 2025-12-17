# Specification: User-Adaptive Content Customization

## 1. Overview
The "Customize Content" feature allows authenticated users to view course material rewritten specifically for their technical experience levels. By leveraging an LLM (Large Language Model) on the backend and user profile data (Software/Hardware experience), the system dynamically simplifies or deepens the technical explanation of the text.

## 2. User Stories
- **As a Beginner Student**, I want complex jargon rewritten with analogies and simple explanations so that I can understand the core concepts of Physical AI without getting overwhelmed.
- **As an Advanced Engineer**, I want concise, technical descriptions without fluff so that I can focus on implementation details and specs.
- **As a User**, I want to toggle between the original text, the Urdu translation, and the customized English version seamlessly.

## 3. Architecture

### Frontend (React / Docusaurus)
- **Component:** `ChapterTranslator.tsx`
- **Context:** `AuthContext` (provides `user`, `authToken`, `loading`).
- **UI:** A "Customize Content" button located next to the Translation button.
- **State Management:**
  - `isContentCustomized`: Boolean flag.
  - `customizedContent`: String storage for LLM response.
  - `user`: Object containing `software_experience` and `hardware_experience`.

### Backend (FastAPI)
- **Authentication:** OAuth2 with JWT (Access/Refresh tokens).
- **Database:** SQLModel (Users table stores experience preferences).
- **AI Agent:** A specialized Agent configured to rewrite text based on specific guidelines (Beginner/Intermediate/Advanced).
- **Endpoints:**
  - `POST /customize_text`: The core logic endpoint.
  - `GET /users/me`: To retrieve user preferences on frontend load.
