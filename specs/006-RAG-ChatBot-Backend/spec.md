# RAG Chatbot Backend Specification

## 1. Project Overview
A FastAPI-based backend service for the Physical AI & Humanoid Robotics course chatbot. The backend provides a REST API endpoint that accepts chat messages, processes them through an OpenAI-compatible agent using Google Gemini 2.0 Flash, and returns AI-generated responses contextual to course curriculum and hardware requirements.

## 2. Technical Stack
*   **Framework:** FastAPI 0.122.0
*   **Agent Framework:** openai-agents 0.6.1
*   **LLM Provider:** Google Gemini 2.0 Flash (via OpenAI-compatible API)
*   **Configuration:** python-dotenv for environment variables
*   **Server:** Uvicorn 0.38.0
*   **Validation:** Pydantic 2.12.5
*   **Deployment:** Vercel (Python runtime 3.10)

## 3. API Requirements

### 3.1 POST `/chat` Endpoint
*   **Purpose:** Process user messages and return AI-generated responses.
*   **Request Body:**
    ```json
    {
      "messages": [
        { "role": "user|bot", "text": "string" },
        { "role": "user|bot", "text": "string" }
      ]
    }
    ```
*   **Response Success (200):**
    ```json
    {
      "response": "string (Markdown-formatted AI response)"
    }
    ```
*   **Response Error (500):**
    ```json
    {
      "detail": "error message string"
    }
    ```

### 3.2 GET `/` Endpoint (Health Check)
*   **Purpose:** Verify API health and configuration status.
*   **Response (200):**
    ```json
    {
      "status": "healthy",
      "response": "api set|API key missing",
      "gemini_api_key_set": boolean,
      "web_url": "string"
    }
    ```

## 4. Agent Requirements

### 4.1 Agent Configuration
*   **Name:** "Physical AI & Humanoid Robotics course's Assistant"
*   **Model:** Gemini 2.0 Flash
*   **Type:** Stateless (no persistent memory between requests)
*   **Instruction Set:** Specialized domain knowledge (see Section 4.2)

### 4.2 Agent Instructions & Knowledge Base
The agent MUST have deep contextual knowledge of:

**Course Structure:**
- Module 1: The Robotic Nervous System (ROS 2)
- Module 2: The Digital Twin (Gazebo & Unity)
- Module 3: The AI-Robot Brain (NVIDIA Isaac)
- Module 4: Vision-Language-Action (VLA) Models

**Hardware Requirements:**
- Sim Rig Specs: NVIDIA RTX 4070 Ti+ (12GB VRAM min), i7 13th Gen+, 64GB DDR5, Ubuntu 22.04 LTS
- Edge AI: NVIDIA Jetson Orin Nano (8GB) or Orin NX
- Sensors: Intel RealSense D435i, USB IMU, ReSpeaker Mic Array
- Robots: Unitree Go2 Edu, Unitree G1 (Humanoid), Hiwonder TonyPi Pro

**Lab Setup Options:**
- On-Premise: High CapEx (buying PCs + robots)
- Cloud/Ether Lab: High OpEx (~$205/quarter for AWS g5.2xlarge)

### 4.3 Response Behavior
*   **Tone:** Technical, academic, helpful
*   **Format:** Markdown with bold emphasis, bullet points, code blocks
*   **Scope:** Strictly course-related; politely decline off-topic questions
*   **Specificity:** Provide exact specs (VRAM, OS versions, CPU generations) for hardware questions
*   **Context:** Accept full conversation history for better contextual responses

## 5. Middleware & Security

### 5.1 CORS Configuration
*   **Allowed Origin:** Dynamic from `WEB_URL` environment variable
*   **Credentials:** Enabled
*   **Methods:** All HTTP methods
*   **Headers:** All headers

### 5.2 Environment Variables
*   `GEMINI_API_KEY` — Google Gemini API key (required)
*   `WEB_URL` — Frontend URL for CORS validation (required for production)

## 6. Error Handling

### 6.1 Error States
- Missing API Key: Return health check with `gemini_api_key_set: false`
- API Rate Limit: Return 500 error with "API Limit has reached"
- Invalid Request: Return 422 validation error via Pydantic
- Agent Execution Failure: Return 500 with exception message
- Empty Message Content: Log warning and process gracefully

### 6.2 Logging
*   Input messages logged: `📥 Received messages: [...]`
*   Agent execution logged: `⚙️ Running agent...`
*   Success logged: `✅ Response generated successfully`
*   Errors logged: `❌ Error: [exception details]`

## 7. Non-Functional Requirements

### 7.1 Performance
*   Response time: Target < 10 seconds per chat message (depends on Gemini latency)
*   Concurrent requests: Handle multiple simultaneous requests via async/await
*   Payload size: Support messages up to 50KB per request

### 7.2 Reliability
*   Service uptime: Target 99% availability on Vercel
*   Graceful degradation: Return meaningful errors on API failures
*   Monitoring: Health endpoint for uptime monitoring

### 7.3 Scalability
*   Deployment: Vercel serverless (auto-scales)
*   Stateless design: Each request is independent (no session storage)

## 8. Key Entities

*   **ChatMessage:** Individual message with role (user/bot) and text content
*   **ChatRequest:** Collection of ChatMessage objects representing conversation history
*   **Agent:** AI entity with specialized instructions for Physical AI course domain
*   **Config:** RunConfig object containing model, tracing settings, and provider reference