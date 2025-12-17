# Task Checklist

## Backend Development (FastAPI)
- [x] **Database:** Update `auth/models.py` to add `software_experience` and `hardware_experience` columns.
- [x] **Auth:** Implement `read_users_me` endpoint returning the `UserRead` schema.
- [x] **Auth:** Implement `refresh_token` endpoint to handle 401 retries from frontend.
- [x] **AI:** Create `CustomizeTextRequest` schema.
- [x] **AI:** Implement `customize_text_content` endpoint.
- [x] **AI:** Write System Instructions for the Customization Agent (Beginner/Int/Adv logic).
- [x] **Testing:** Verify CORS settings allow requests from `localhost:3000`.

## Frontend Development (React)
- [x] **Context:** Create `AuthContext.js` with `fetchUser`, `login`, `logout`, and `refreshAccessToken` functions.
- [x] **Component:** Modify `ChapterTranslator.tsx` to consume `useAuth`.
- [x] **Logic:** Implement `extractText` recursion (memoized with `useCallback`).
- [x] **Logic:** Implement `handleCustomizeContent` function to call backend.
- [x] **UI:** Add "Customize Content" / "Show Original" toggle button.
- [x] **UI:** Add Loading spinners (`isCustomizing` state).
- [x] **UI:** Create CSS for `.customizedContent` to visually distinguish rewritten text.
- [x] **Error Handling:** Add check `if (!user)` to block customization requests for guests.

## Integration & Verification
- [x] Verify User Registration saves experience levels correctly.
- [x] Verify Login populates `user` object in React Context.
- [x] Test Customization flow:
    1. Log in as "Beginner".
    2. Click Customize.
    3. Verify output text is simplified.
- [x] Test Error flow: Click Customize while logged out -> See error message.