# main.py
import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from dotenv import load_dotenv

# Import Logic from other files
from config import get_active_model_name
from utils import clean_list
from services import (
    analyze_image_for_name,
    check_product_category,
    get_product_from_openfoodfacts,
    generate_health_analysis,
    analyze_natural_food
)

# ---------------- APP SETUP ----------------
load_dotenv()

app = FastAPI(title="Food Health Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    # check that the products category
    category = check_product_category(query)
    result = category
    print("result: ", result)
    
    if result == "packaged_food":
        product = get_product_from_openfoodfacts(query)
        if not product:
            raise HTTPException(404, "Product not found")

        ai = generate_health_analysis(product, query)
        if not ai:
            raise HTTPException(500, "AI analysis failed")
        nutrients = product.get("nutriments", {})

        # Process Labels & Awards for Marketing Section
        raw_labels = product.get("labels_tags", [])
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
                "ingredients_text": product.get("ingredients_text", "Ingredients not found."),
                "image_url": product.get("image_front_url", ""),
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
    elif result == "natural_food":
        print("--- Analyzing Natural Food (Internal Knowledge) ---")
        # Ask AI to generate the full data structure since OpenFoodFacts won't have "Apple"
        ai_data = analyze_natural_food(query)

        if not ai_data:
            raise HTTPException(500, "Failed to analyze natural food.")

        # Map the AI structure to the API response structure
        info = ai_data.get("product_info", {})
        nutri = ai_data.get("nutrition_per_100g", {})
        analysis = ai_data.get("analysis", {})

        return {
            "status": "success",
            "input": {"product_name": query, "type": "natural_food"},
            "product": {
                "name": query,
                "brand": "Natural / Generic",
                "category": info.get("category", "Natural"),
                "country": "Global",
                "ingredients_text": info.get("ingredients_text", "Natural - Single Ingredient"),
                "image_url": info.get("image_url", ""),
            },
            "marketing": {
                "labels": ["Natural", "Whole Food", "Unprocessed"],
                "claims": ["No additives", "Fresh"],
            },
            "images": {
                "input_image": "User Uploaded" if image else "None",
                # Using a Google Search URL as requested for the image link
                "reference_images": [info.get("image_url", "")],
                "source": "Google Knowledge Graph",
            },
            "nutrition": {
                "per_100g": nutri,
                "source_url": f"https://www.google.com/search?q={query}+nutrition",
                "data_confidence": "high (estimated)",
            },
            **analysis,  # verdict, scores, etc.
            "meta": {
                "data_source": "AI Knowledge Base (Simulated Google Search)",
                "analysis_type": "Natural Food Analysis",
            },
        }
    else:
        return {
            "status": "error: data not found",
        }


# ---------------- RUN ----------------

if __name__ == "__main__":
    # Run the model check immediately on startup
    print(f"Startup Check: Using Model -> {get_active_model_name()}")
    
    # Get configuration from .env with fallbacks
    host = os.getenv("HOST", "127.0.0.1") 
    port = int(os.getenv("PORT", "8000")) 

    print(f"🚀 Server starting on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)