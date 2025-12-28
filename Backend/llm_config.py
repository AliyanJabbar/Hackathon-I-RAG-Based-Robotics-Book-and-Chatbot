from dotenv import load_dotenv
import os
from agents import AsyncOpenAI, OpenAIChatCompletionsModel, RunConfig


load_dotenv()

# gemini config not using
gemini_key = os.getenv("GEMINI_API_KEY")

external_client = AsyncOpenAI(
    api_key=gemini_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

external_model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash", openai_client=external_client
)

config = RunConfig(
    model=external_model,
    model_provider=external_client,
)


# openrouter configs for different purposes

# Chat API config
chat_openrouter_key = os.getenv("OPENROUTER_API_KEY_CHATBOT")
if not chat_openrouter_key:
    raise ValueError("OPENROUTER_API_KEY_CHATBOT not found in environment variables")

chat_openrouter_client = AsyncOpenAI(
    api_key=chat_openrouter_key,
    base_url="https://openrouter.ai/api/v1",
)

chat_openrouter_model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b:free",
    openai_client=chat_openrouter_client
)

chat_config = RunConfig(
    model=chat_openrouter_model,
)

# Content Customization API config
customize_openrouter_key = os.getenv("OPENROUTER_API_KEY_CUSTOM_CONTENT")
if not customize_openrouter_key:
    raise ValueError("OPENROUTER_API_KEY_CUSTOM_CONTENT not found in environment variables")

customize_openrouter_client = AsyncOpenAI(
    api_key=customize_openrouter_key,
    base_url="https://openrouter.ai/api/v1",
)

customize_openrouter_model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b:free",
    openai_client=customize_openrouter_client
)

customize_config = RunConfig(
    model=customize_openrouter_model,
)

# Translation API config
translate_openrouter_key = os.getenv("OPENROUTER_API_KEY_TRANSLATION")
if not translate_openrouter_key:
    raise ValueError("OPENROUTER_API_KEY_TRANSLATION not found in environment variables")

translate_openrouter_client = AsyncOpenAI(
    api_key=translate_openrouter_key,
    base_url="https://openrouter.ai/api/v1",
)

translate_openrouter_model = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b:free",
    openai_client=translate_openrouter_client
)

translate_config = RunConfig(
    model=translate_openrouter_model,
)



# ------------------------------ groq config ------------------------------ 

# Chatbot
groq_key_chatbot = os.getenv("GROQ_API_KEY_CHATBOT")

if not groq_key_chatbot:
    raise ValueError("GROQ_API_KEY_CHATBOT not found in environment variables")

groq_client_chatbot = AsyncOpenAI(
    api_key=groq_key_chatbot,
    base_url="https://api.groq.com/openai/v1",
)

groq_model_chatbot = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b", 
    openai_client=groq_client_chatbot
)

groq_config_chatbot = RunConfig(
    model=groq_model_chatbot,
    model_provider=groq_client_chatbot
)

# Content Customization
groq_key_content = os.getenv("GROQ_API_KEY_CONTENT")

if not groq_key_content:
    raise ValueError("GROQ_API_KEY_CONTENT not found in environment variables")

groq_client_content = AsyncOpenAI(
    api_key=groq_key_content,
    base_url="https://api.groq.com/openai/v1",
)

groq_model_content = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b", 
    openai_client=groq_client_content
)

groq_config_content = RunConfig(
    model=groq_model_content,
    model_provider=groq_client_content
)

# Translation
groq_key_translation = os.getenv("GROQ_API_KEY_TRANSLATE")

if not groq_key_translation:
    raise ValueError("GROQ_API_KEY_TRANSLATE not found in environment variables")

groq_client_translation = AsyncOpenAI(
    api_key=groq_key_translation,
    base_url="https://api.groq.com/openai/v1",
)

groq_model_translation = OpenAIChatCompletionsModel(
    model="openai/gpt-oss-20b", 
    openai_client=groq_client_translation
)

groq_config_translation = RunConfig(
    model=groq_model_translation,
    model_provider=groq_client_translation
)