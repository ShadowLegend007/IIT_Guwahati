import os
import json
import requests
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()

# Initialize Client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ---------------- APP SETUP ----------------
app = FastAPI(title="Food Health Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HELPERS ----------------

# GLOBAL VARIABLE to store the working model name so we don't check every time
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
                # The name usually comes as 'models/gemini-1.5-flash', we need just the ID often
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
        # Final fallback if listing fails (common default)
        return "gemini-1.5-flash"

    return "gemini-1.5-flash"


def clean_list(items):
    if not items:
        return []
    return [str(x).replace("en:", "").replace("-", " ").title() for x in items]

def clean_json_text(text: str) -> str:
    """Helper to strip markdown code blocks."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def get_product_from_openfoodfacts(query: str):
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 1,
    }
    headers = {"User-Agent": "IncognitoHealthAI/1.0"}

    try:
        r = requests.get(url, params=params, headers=headers, timeout=20)
        if r.status_code != 200:
            return None
        data = r.json()
        return data["products"][0] if data.get("products") else None
    except Exception as e:
        print(f"OpenFoodFacts Error: {e}")
        return None


def analyze_image_for_name(image_bytes: bytes):
    model_name = get_active_model_name()
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text="Identify the product name and brand. Return ONLY the name."
                        ),
                        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    ],
                )
            ],
        )
        return response.text.strip()
    except Exception as e:
        print(f"Image Analysis Error ({model_name}): {e}")
        return "Unknown Product"


# ---------------- AI ANALYSIS ----------------


def generate_health_analysis(product, product_name):
    nutrients = product.get("nutriments", {})
    ingredients_text = product.get("ingredients_text", "Unknown")

    labels = clean_list(product.get("labels_tags", []))
    additives = clean_list(product.get("additives_tags", []))
    categories = clean_list(product.get("categories_tags", []))

    nova = product.get("nova_group", "Unknown")
    brand = product.get("brands", "Unknown")

    model_name = get_active_model_name()

    prompt = f"""
        You are an AI food interpretation assistant.
        Your job is to help a user understand whether a food is a good daily choice.

        Product: {product_name}
        Brand: {brand}
        Categories: {", ".join(categories)}

        Nutrition per 100g:
        Sugar: {nutrients.get("sugars_100g", "?")} g
        Salt: {nutrients.get("salt_100g", "?")} g
        Fat: {nutrients.get("fat_100g", "?")} g
        Calories: {nutrients.get("energy-kcal_100g", "?")} kcal
        Processing Level (NOVA): {nova}
        Ingredients: {ingredients_text}
        Additives: {", ".join(additives)}
        Labels: {", ".join(labels)}

        IMPORTANT:
        - Interpret, do not list numbers
        - No medical advice
        - If unsure, be honest
        - Reduce cognitive load
        - Output MUST contain ALL fields

        Return STRICT JSON in this exact format:

        {{
        "verdict": {{
            "label": "safe | occasionally_safe | not_safe",
            "headline": "SAFE | OCCASIONALLY SAFE | NOT SAFE",
            "subtext": "short explanation"
        }},
        "overall_score": {{
            "percent": 0-100,
            "interpretation": "short text"
        }},
        "nutrition_score": {{
            "grade": "A | B | C | D | E"
        }},
        "key_takeaways": {{
            "possible_concern": "string",
            "generally_safe": "string",
            "depends_on_use": "string"
        }},
        "age_suitability": {{
            "children_0_12": "string",
            "young_12_45": "string",
            "adults_45_plus": "string"
        }},
        "health_suitability": {{
            "diabetes": "string",
            "heart": "string",
            "weight": "string",
            "normal": "string"
        }},
        "ai_opinion": {{
            "text": "This product is generally okay to consume, but please check the manufacturing date."
        }}
        }}
        """

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )

        raw_text = clean_json_text(response.text)
        return json.loads(raw_text)

    except Exception as e:
        print(f"Health Analysis Error ({model_name}): {e}")
        return None


# ---------------- API ----------------


@app.post("/analyze")
async def analyze(
    product_name: Optional[str] = Form(None), image: Optional[UploadFile] = File(None)
):
    query = product_name
    print(product_name)
    image_used = False

    if image:
        image_used = True
        contents = await image.read()
        if not query:
            query = analyze_image_for_name(contents)

    if not query:
        raise HTTPException(400, "Provide product name or image")

    product = get_product_from_openfoodfacts(query)
    if not product:
        raise HTTPException(404, "Product not found")

    ai = generate_health_analysis(product, query)
    if not ai:
        raise HTTPException(500, "AI analysis failed")
    nutrients = product.get('nutriments', {})
    
    # Process Labels & Awards for Marketing Section
    raw_labels = product.get('labels_tags', [])
    clean_label_list = clean_list(raw_labels)

    return {
        "status": "success",
        "input": {
            "product_name": query,
            "input_type": "image" if image_used else "text",
            "image_provided": image_used,
        },
        "product": {
            "name": product.get("product_name", query),
            "brand": product.get("brands", "Unknown"),
            "category": (
                product.get("categories", "").split(",")[0]
                if product.get("categories")
                else "Unknown"
            ),
            "country": product.get("countries", "Unknown"),
        },
        "marketing": {
            "labels": clean_label_list,
            "claims": [l for l in clean_label_list if "Free" in l or "No " in l],
        },
        "images": {
            "input_image": image,
            "reference_images": [
                product.get("image_front_url", ""),
                product.get("image_ingredients_url", ""),
                product.get("image_nutrition_url", ""),
            ],
            "source": "openfoodfacts",
        },
        "nutrition": {
            "per_100g": {
                "energy_kcal": nutrients.get("energy-kcal_100g", 0),
                "protein_g": nutrients.get("proteins_100g", 0),
                "carbs_g": nutrients.get("carbohydrates_100g", 0),
                "sugar_g": nutrients.get("sugars_100g", 0),
                "fat_g": nutrients.get("fat_100g", 0),
                "sat_fat_g": nutrients.get("saturated-fat_100g", 0),
                "sodium_mg": float(nutrients.get("salt_100g", 0) or 0) * 1000,
            },
            "source_url": f"https://world.openfoodfacts.org/product/{product.get('code')}",
            "data_confidence": "high",
        },
        **ai,
        "meta": {
            "data_source": "OpenFoodFacts",
            "analysis_type": "AI-interpreted",
            "confidence_level": "medium",
        },
    }


# ---------------- RUN ----------------

if __name__ == "__main__":
    # Run the model check immediately on startup
    print(f"Startup Check: Using Model -> {get_active_model_name()}")
    uvicorn.run(app, host="127.0.0.1", port=8000)
