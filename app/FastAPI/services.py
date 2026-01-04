# services.py
import requests
import json
from google.genai import types
from config import client, get_active_model_name
from utils import clean_list, clean_json_text

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


def check_product_category(product):
    model = get_active_model_name()
    try:
        response = client.models.generate_content(
            model=model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text=f"""
                            Classify the input into exactly one of these categories: natural_food, packaged_food, non_food.

                            Rules:
                            1. Output ONLY the category name.
                            2. Do NOT output "Unknown Product".
                            3. If unsure, classify as "packaged_food".

                            Input: Apple
                            Output: natural_food

                            Input: Horlicks
                            Output: packaged_food

                            Input: Bus
                            Output: non_food

                            Input: {product}
                            Output:
                            """
                        ),
                    ],
                )
            ],
            config=types.GenerateContentConfig(temperature=0),
        )
        return clean_json_text(response.text).strip()

    except Exception as e:
        print(f"Category Check Error ({product}): {e}")
        return "packaged_food"


def generate_generic_analysis(prompt_text):
    """Shared AI caller for both paths"""
    model_name = get_active_model_name()
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt_text,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        return json.loads(clean_json_text(response.text))
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return None


def analyze_natural_food(item_name: str):
    prompt = f"""
    You are analyzing a natural food item: "{item_name}".
    
    1. Act as a nutritional database. Estimate the nutritional values for 100g of this item.
    2. Then, perform the health analysis.
    
    Return a single JSON object that combines RAW DATA and ANALYSIS.
    Structure must match this exactly:

    {{
        "product_info": {{
            "brand": "Nature",
            "category": "Natural Food",
            "ingredients_text": "100% {item_name}",
            "image_url": "[https://www.google.com/search?tbm=isch&q=](https://www.google.com/search?tbm=isch&q=){item_name.replace(' ', '+')}"
        }},
        "nutrition_per_100g": {{
            "energy_kcal": number,
            "protein_g": number,
            "carbs_g": number,
            "sugar_g": number,
            "fat_g": number,
            "sat_fat_g": number,
            "sodium_mg": number
        }},
        "analysis": {{
            "verdict": {{ "label": "safe", "headline": "EXCELLENT CHOICE", "subtext": "..." }},
            "overall_score": {{ "percent": 90, "interpretation": "..." }},
            "nutrition_score": {{ "grade": "A" }},
            "key_takeaways": {{ "possible_concern": "...", "generally_safe": "...", "depends_on_use": "..." }},
            "age_suitability": {{ "children_0_12": "...", "young_12_45": "...", "adults_45_plus": "..." }},
            "health_suitability": {{ "diabetes": "...", "heart": "...", "weight": "...", "normal": "..." }},
            "ai_opinion": {{ "text": "..." }}
        }}
    }}
    """
    return generate_generic_analysis(prompt)


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
        return json.loads(clean_json_text(response.text))

    except Exception as e:
        print(f"Health Analysis Error ({model_name}): {e}")
        return None