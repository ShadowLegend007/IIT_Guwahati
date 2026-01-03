import os
import json
import requests
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

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

def clean_list(items):
    if not items:
        return []
    return [str(x).replace("en:", "").replace("-", " ").title() for x in items]

def get_product_from_openfoodfacts(query: str):
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 1
    }
    headers = {"User-Agent": "IncognitoHealthAI/1.0"}

    try:
        r = requests.get(url, params=params, headers=headers, timeout=20)
        if r.status_code != 200:
            return None
        data = r.json()
        return data["products"][0] if data.get("products") else None
    except Exception:
        return None

def analyze_image_for_name(image_bytes: bytes):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([
            "Identify the product name and brand. Return ONLY the name.",
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        return response.text.strip()
    except Exception:
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

    model = genai.GenerativeModel(
        "gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )

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
    "text": "This product is generally okay to consume, but please check the manufacturing date. If it has been more than 5 months, I would not recommend consuming it."
  }}
}}
"""

    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception:
        return None

# ---------------- API ----------------

@app.post("/analyze")
async def analyze(
    product_name: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    query = product_name
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

    return {
        "input": {
            "product_name": query,
            "input_type": "image" if image_used else "text",
            "image_provided": image_used
        },
        **ai,
        "meta": {
            "data_source": "OpenFoodFacts",
            "analysis_type": "AI-interpreted",
            "confidence_level": "medium"
        }
    }

# ---------------- RUN ----------------

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)