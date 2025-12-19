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
    tracing_disabled=True,
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
    tracing_disabled=True,
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
    tracing_disabled=True,
)
