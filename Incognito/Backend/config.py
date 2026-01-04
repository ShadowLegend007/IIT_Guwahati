# config.py
import os
from dotenv import load_dotenv
from google import genai

# ---------------- LOAD ENV ----------------
load_dotenv()

# Initialize Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# GLOBAL VARIABLE to store the working model name
ACTIVE_MODEL_NAME = None

def get_active_model_name():
    """
    Automatically finds a working model name for your account.
    Prioritizes 'flash' models.
    """
    global ACTIVE_MODEL_NAME
    if ACTIVE_MODEL_NAME:
        return ACTIVE_MODEL_NAME

    print("--- Finding available Gemini model... ---")
    try:
        # List all models available to your API key
        all_models = list(client.models.list())

        # 1. Try to find a 'flash' model (fastest/cheapest)
        for m in all_models:
            if "flash" in m.name and "gemini" in m.name:
                clean_name = m.name.replace("models/", "")
                print(f"✅ Found preferred model: {clean_name}")
                ACTIVE_MODEL_NAME = clean_name
                return clean_name

        # 2. If no flash, take any 'gemini' model
        for m in all_models:
            if "gemini" in m.name:
                clean_name = m.name.replace("models/", "")
                print(f"⚠️ 'Flash' not found. Using fallback: {clean_name}")
                ACTIVE_MODEL_NAME = clean_name
                return clean_name

    except Exception as e:
        print(f"❌ Error listing models: {e}")
        return "gemini-1.5-flash"

    return "gemini-1.5-flash"