from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Literal
import os
from dotenv import load_dotenv

# --- EXISTING CHAT IMPORTS ---
from agents import Agent, Runner
from llm_config import config, gemini_key, chat_config, customize_config, translate_config
from qdrant.qdrant_retrieval import retrieve_data

# --- AUTH & DB IMPORTS ---
from auth.db import init_db, get_session
from auth.models import User # Assuming User model has software_experience and hardware_experience
from auth.schemas import UserCreate, UserRead, Token
from auth.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_refresh_token, 
    get_current_user,
    decode_token
)


# --- STARTUP EVENT ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

# --- CORS SETUP ---
# Combine your WEB_URL with localhost for flexibility
origins = [
    "http://localhost:3000",
    "http://127.00.1:3000",
]

load_dotenv()

web_url = os.getenv("WEB_URL")
if web_url:
    origins.append(web_url)

print("🌐 CORS allowed origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/register", response_model=UserRead)
async def register(user: UserCreate, session: AsyncSession = Depends(get_session)):
    statement = select(User).where(User.email == user.email)
    result = await session.exec(statement)
    existing_user = result.first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    
    new_user = User(
        email=user.email, 
        name=user.name,
        software_experience=user.software_experience,
        hardware_experience=user.hardware_experience,
        hashed_password=hashed_pwd
    )
    
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_session)):
    """
    Login to get Access Token and Refresh Token.
    """
    statement = select(User).where(User.email == form_data.username)
    result = await session.exec(statement)
    user = result.first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "token_type": "bearer"
    }

@app.post("/refresh", response_model=Token)
async def refresh_token(token_data: dict, session: AsyncSession = Depends(get_session)):
    """
    Use a long-lived refresh token to get a new access token.
    """
    refresh_token_str = token_data.get("refresh_token")
    if not refresh_token_str:
        raise HTTPException(status_code=400, detail="Refresh token missing")

    payload = decode_token(refresh_token_str)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    email = payload.get("sub")
    statement = select(User).where(User.email == email)
    result = await session.exec(statement)
    user = result.first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return {
        "access_token": create_access_token(data={"sub": user.email}),
        "refresh_token": create_refresh_token(data={"sub": user.email}),
        "token_type": "bearer"
    }

@app.get("/users/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged-in user profile (includes Name, Software/Hardware Experience).
    """
    return current_user

# ==========================================
# USER PREFERENCE ENDPOINTS
# ==========================================

# NOTE: The UserRead model already contains software_experience and hardware_experience.
# So, GET /preference can just return the UserRead model.
@app.get("/preference", response_model=UserRead)
async def get_user_preference(current_user: User = Depends(get_current_user)):
    """
    Retrieves the current logged-in user's profile, which includes preference-like fields
    such as software_experience and hardware_experience.
    """
    return current_user

# If you wanted to allow users to update these fields *specifically* through a preference endpoint,
# you'd need a separate Pydantic model for update and a PUT/PATCH endpoint.
# For now, fetching the UserRead via /preference is sufficient as per the current flow.


# ==========================================
# CONTENT CUSTOMIZATION ENDPOINTS
# ==========================================

# Define a new Pydantic model for the request to customize text
class CustomizeTextRequest(BaseModel):
    text: str
    software_experience: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    hardware_experience: Literal["beginner", "intermediate", "advanced"] = "intermediate"

@app.post("/customize_text")
async def customize_text_content(
    request_data: CustomizeTextRequest,
    current_user: User = Depends(get_current_user), # Still require authenticated user
    session: AsyncSession = Depends(get_session) # Not directly used but kept for consistency
):
    """
    Customizes the provided text based on user's software and hardware experience levels
    using an LLM agent.
    """
    print(f"📥 Received customization request for user {current_user.email} with preferences:")
    print(f"   Software Experience: {request_data.software_experience}")
    print(f"   Hardware Experience: {request_data.hardware_experience}")
    print(f"   Text (first 100 chars): {request_data.text[:100]}...")

    try:
        # Define the Agent specifically for content customization
        customization_agent = Agent(
            name="Content Customization AI",
            instructions=f"""
            You are an AI assistant specialized in adapting technical content about Physical AI and Humanoid Robotics.
            Your task is to rewrite the provided text to match the user's specified experience levels.

            ### CUSTOMIZATION GUIDELINES:
            -   **Target Audience:** The user has indicated their experience level in software as '{request_data.software_experience}' and hardware as '{request_data.hardware_experience}'.
            -   **Beginner Level:**
                -   Simplify complex jargon.
                -   Provide brief, clear explanations for technical terms.
                -   Focus on high-level concepts rather than deep implementation details.
                -   Use analogies if helpful.
                -   Keep sentences relatively short and direct.
            -   **Intermediate Level:**
                -   Explain technical terms clearly but assume some foundational understanding.
                -   Mention key concepts and tools without excessive detail on basics.
                -   Can introduce slightly more complex ideas but still with explanations.
            -   **Advanced Level:**
                -   Assume familiarity with most common technical terms and concepts.
                -   Focus on precision, efficiency, and deeper technical insights.
                -   Can use specialized jargon without extensive explanation.
                -   Delve into implementation aspects, performance considerations, and advanced topics.

            ### PROCESS:
            1.  Read the provided text carefully.
            2.  Rewrite the entire text, making sure it aligns with the '{request_data.software_experience}' software experience and '{request_data.hardware_experience}' hardware experience.
            3.  Maintain all factual information and the original meaning.
            4.  Output only the rewritten text, do not add conversational remarks.
            """,
            tools=[retrieve_data] 
        )

        messages_for_llm = [
            ChatMessage(role="user", text=f"Please rewrite the following content for a user with software experience '{request_data.software_experience}' and hardware experience '{request_data.hardware_experience}':\n\n{request_data.text}")
        ]

        customized_result = await Runner.run(
            customization_agent,
            input="\n".join([f"{m.role}: {m.text}" for m in messages_for_llm]), 
            run_config=customize_config, 
        )

        print("✅ Content customized successfully")
        return {"customized_content": customized_result.final_output}

    except Exception as e:
        print("❌ Customization Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to customize content: {str(e)}")


# ==========================================
# TRANSLATION ENDPOINTS
# ==========================================

class TranslateRequest(BaseModel):
    text: str
    target_language: str = "Urdu"  # Default to Urdu, can be extended

@app.post("/translate")
async def translate_text(
    request_data: TranslateRequest,
):
    """
    Translates the provided text to the target language using an LLM agent.
    """
    print(f"   Text (first 100 chars): {request_data.text[:100]}...")

    try:
        # Define the Agent specifically for translation
        translation_agent = Agent(
            name="Translation AI",
            instructions=f"""
            You are a specialized AI assistant for translating technical content about Physical AI and Humanoid Robotics.
            Your task is to translate the provided text to '{request_data.target_language}' language.

            ### TRANSLATION GUIDELINES:
            - **Target Language:** Translate to {request_data.target_language} (e.g., 'ur' for Urdu, 'es' for Spanish, etc.)
            - **Technical Accuracy:** Maintain all technical terms, jargon, and concepts accurately
            - **Context Preservation:** Keep the meaning, tone, and technical context intact
            - **Cultural Adaptation:** Adapt examples and references appropriately for the target language if needed
            - **Formatting:** Preserve markdown formatting, code snippets, and technical notations

            ### PROCESS:
            1. Read the provided text carefully.
            2. Translate the entire text to {request_data.target_language}.
            3. Ensure technical terms are translated appropriately or kept in English if standard.
            4. Output only the translated text, do not add conversational remarks.
            """,
        )

        messages_for_llm = [
            ChatMessage(role="user", text=f"Please translate the following text to {request_data.target_language}:\n\n{request_data.text}")
        ]

        translation_result = await Runner.run(
            translation_agent,
            input="\n".join([f"{m.role}: {m.text}" for m in messages_for_llm]),
            run_config=translate_config,
        )

        print("✅ Translation completed successfully")
        return {"translated_text": translation_result.final_output}

    except Exception as e:
        print("❌ Translation Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to translate text: {str(e)}")


# ==========================================
# CHATBOT ENDPOINTS
# ==========================================

class ChatMessage(BaseModel):
    role: Literal["user", "bot"]
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/chat")
async def chat(request: ChatRequest):
    print("📥 Received messages:", request.messages)

    try:
        agent = Agent(
            name="Physical AI & Humanoid Robotics course's Assistant",
            instructions="""
            You are the specialized AI Assistant for the "Physical AI & Humanoid Robotics" Capstone Course. 
            Your goal is to help students understand the curriculum, hardware requirements, and technical concepts of bridging the digital brain with the physical body.

            ### COURSE CONTEXT & KNOWLEDGE BASE:
            
            **Focus:** AI Systems in the Physical World (Embodied Intelligence).
            **Goal:** Applying AI to control Humanoid Robots in simulated and real-world environments using ROS 2, Gazebo, and NVIDIA Isaac.

            **Module Breakdown:**
            1. **The Robotic Nervous System (ROS 2):** Nodes, Topics, Services, rclpy, URDF.
            2. **The Digital Twin (Gazebo & Unity):** Physics simulation, LiDAR/Depth sensors, collision dynamics.
            3. **The AI-Robot Brain (NVIDIA Isaac):** Isaac Sim (Photorealistic sim), Isaac ROS (VSLAM), Nav2 (Path planning).
            4. **Vision-Language-Action (VLA):** OpenAI Whisper (Voice), LLMs for cognitive planning ("Clean the room" -> ROS actions).

            **Hardware Requirements (Critical):**
            - **Sim Rig (Workstation):** Must have NVIDIA RTX 4070 Ti (12GB VRAM) or higher (Ideal: RTX 3090/4090). CPU: i7 13th Gen+. RAM: 64GB DDR5. OS: Ubuntu 22.04 LTS.
            - **Edge AI Kit:** NVIDIA Jetson Orin Nano (8GB) or Orin NX.
            - **Sensors:** Intel RealSense D435i (Vision+Depth), Generic USB IMU, ReSpeaker Mic Array.
            - **Robots:** Unitree Go2 Edu (Quadruped proxy), Unitree G1 (Humanoid), or Hiwonder TonyPi Pro (Budget/Kinematics only).

            **Lab Setup Options:**
            - **On-Prem (High CapEx):** Buying physical PCs and robots.
            - **Cloud/Ether Lab (High OpEx):** AWS g5.2xlarge instances (~$205/quarter) + Local Jetson Kit ($700) for deployment.

            ### ANSWERING GUIDELINES:
            - **Mandatory Tool Use:** Before answering any question related to Humanoid Robotics or Physical AI concepts, you **must call the tool `retrieve_data`** to get relevant content from the course knowledge base.
            - **Tone:** Technical, academic, and helpful. 
            - **Format:** Use Markdown (bold key terms, bullet points for lists).
            - **Scope:** Answer strictly based on the provided course material.
            - **Refusals:** Politely decline to answer off-topic questions (e.g., "What is the weather?", "Tell me a joke").
            - **Hardware Questions:** Be very specific about specs (VRAM, OS versions) as this is a technical bottleneck for the course.
            - **Tool Instructions:** Only use `retrieve_data` to fetch content. After fetching, summarize or reformat as needed to answer the user query. Do not answer without using it first.
            """,
            tools=[retrieve_data]
        )

        print("⚙️ Running agent... ")

        conversation_context = "\n".join(
            [f"{message.role}: {message.text}" for message in request.messages]
        )

        result = await Runner.run(
            agent,
            input=conversation_context,
            run_config=chat_config,
        )

        print("✅ Response generated successfully")

        return {"response": result.final_output}

    except Exception as e:
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def health():
    return {
        "status": "healthy",
        "response": "api set" if gemini_key else "API key missing",
        "gemini_api_key_set": bool(gemini_key),
        "web_url": os.getenv("WEB_URL", "not set"),
    }