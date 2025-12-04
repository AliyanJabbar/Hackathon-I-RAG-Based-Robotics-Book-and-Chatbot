# RAG Chatbot Backend Implementation Tasks

---

## Phase 1 — Environment & Dependencies Setup

- [X] Validate Python 3.10 is available locally and on Vercel runtime
- [X] Create `.env` file template with required variables:
      - `GEMINI_API_KEY=your_key_here`
      - `WEB_URL=http://localhost:3000` (for local) or production URL
- [X] Populate `requirements.txt` with final dependencies
- [X] Install dependencies: `pip install -r requirements.txt`
- [X] Test import of all packages (fastapi, openai-agents, pydantic, etc.)
- [X] Verify `vercel.json` is configured for Python runtime 3.10

---

## Phase 2 — Core API Setup (main.py)

- [X] Import all required modules (FastAPI, CORSMiddleware, Pydantic, Agents, config, os)
- [X] Initialize FastAPI app instance
- [X] Configure CORSMiddleware with dynamic WEB_URL from environment
- [X] Define `ChatMessage` Pydantic model:
      - Fields: `role` (Literal["user", "bot"]), `text` (str)
- [X] Define `ChatRequest` Pydantic model:
      - Fields: `messages` (List[ChatMessage])
- [X] Implement `GET /` health check endpoint:
      - Returns status, gemini_api_key_set, web_url
      - Callable without authentication

---

## Phase 3 — Chat Endpoint Implementation

- [X] Implement `POST /chat` async endpoint
- [X] Add request validation via Pydantic (ChatRequest)
- [X] Extract message history from request
- [X] Format conversation context string:
      - Pattern: `"role: text\nrole: text\n..."`
- [X] Initialize Agent with specialized instructions (from spec)
- [X] Call `await Runner.run()` with agent, context, and config
- [X] Extract `result.final_output` as response
- [X] Return JSON: `{"response": result.final_output}`
- [X] Wrap execution in try-except with HTTPException(status_code=500)
- [X] Add console logging at each step (📥, ⚙️, ✅, ❌)

---

## Phase 4 — Agent Instructions & Configuration

- [X] Create comprehensive agent instructions covering:
      - Course modules (The Robotic Nervous System, Digital Twin, AI-Robot Brain, VLA)
      - Hardware requirements (Sim Rig specs, Edge AI, Sensors, Robots)
      - Lab setup options (On-Prem vs. Cloud/Ether Lab costs)
      - Response guidelines (Technical tone, Markdown format, course scope only)
      - Refusal examples (Weather, jokes) with polite decline message
- [X] Configure Gemini 2.0 Flash as model in `my_config.py`:
      - API endpoint: `https://generativelanguage.googleapis.com/v1beta/openai/`
      - Model name: `gemini-2.0-flash`
- [X] Set Agent name: "Physical AI & Humanoid Robotics course's Assistant"
- [X] Test agent with 5+ sample queries covering different topics:
      - ROS 2 question
      - Hardware requirement question
      - Lab setup option question
      - Off-topic question (should decline)
      - Follow-up question (with message history)

---

## Phase 5 — Error Handling & Logging

- [X] Verify API key is loaded from environment at startup
- [X] Implement check for `gemini_key` availability in health endpoint
- [X] Add logging for received messages (console: `📥`)
- [X] Add logging for agent execution (console: `⚙️`)
- [X] Add logging for successful responses (console: `✅`)
- [X] Add logging for errors (console: `❌ Error:`)
- [X] Handle empty message content gracefully
- [X] Handle API rate limit errors with user-friendly message
- [X] Handle network/timeout errors with appropriate HTTP 500 response

---

## Phase 6 — CORS & Security Testing

- [X] Verify CORS middleware accepts requests from WEB_URL
- [X] Test requests from Docusaurus frontend (localhost:3000)
- [X] Verify CORS headers in response:
      - `Access-Control-Allow-Origin`
      - `Access-Control-Allow-Credentials`
- [X] Test with OPTIONS preflight request
- [X] Verify request body size limits are reasonable (50KB+)

---

## Phase 7 — Local Testing & Validation

- [X] Run backend locally: `uvicorn main:app --reload`
- [X] Test `GET /` health endpoint via curl/Postman
- [X] Test `POST /chat` with sample ChatRequest payload
- [X] Verify Markdown responses render correctly (test with lists, bold, code blocks)
- [X] Test conversation history is preserved across requests
- [X] Test error cases (missing API key, invalid request, etc.)
- [X] Verify response time is < 10 seconds (normal case)

---

## Phase 8 — Vercel Deployment

- [X] Verify `vercel.json` configuration:
      - Build: `src: "main.py"`, runtime: `python3.10`
      - Routes: `(.*) -> main.py`
- [X] Set environment variables in Vercel dashboard:
      - `GEMINI_API_KEY`
      - `WEB_URL` (production frontend URL)
- [X] Deploy to Vercel: `vercel --prod`
- [X] Test production `/` health endpoint
- [X] Test production `/chat` endpoint with sample message
- [X] Monitor Vercel logs for errors
- [X] Verify CORS headers work from production frontend

---

## Phase 9 — Production Validation & Monitoring

- [X] Monitor first 10 user interactions for correctness
- [X] Verify Gemini API responses are relevant to course
- [X] Check response times in production environment
- [X] Validate error handling on rate limits
- [X] Set up health check monitoring (ping `/` every 5 minutes)
- [X] Document known limitations in README
- [X] Create troubleshooting guide for common issues

---

## Phase 10 — Documentation & Cleanup

- [X] Update `Backend/README.md` with:
      - How to run locally
      - Environment variables required
      - API endpoint documentation
      - Example requests/responses
      - Deployment instructions
- [X] Add inline code comments explaining Agent instructions
- [X] Document any config changes from initial setup
- [X] Create `.env.example` template
- [X] Clean up debug console logs (keep essentials like errors)