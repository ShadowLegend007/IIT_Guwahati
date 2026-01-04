# AI Food Health Analyzer (By Team INCOGNITO)

A smart backend service that analyzes food products to provide detailed health insights, nutritional scoring, and consumption advice. It combines real-world database data (OpenFoodFacts) with Generative AI (Google Gemini) to interpret food labels like a nutritionist.

## Features

* **Hybrid Analysis Engine:**
    * **Packaged Foods:** Fetches accurate nutritional data from OpenFoodFacts and uses AI to interpret the health impact.
    * **Natural Foods:** Uses AI's internal knowledge base to estimate nutrition for raw items (e.g., "Apple", "Banana") where barcodes don't exist.
* **Smart Classification:** Automatically detects if an input is a *Natural Food*, *Packaged Food*, or *Non-Food* item.
* **Image Recognition:** Users can upload an image of a product, and the system will identify the product name and brand automatically.
* **Health Scoring:** Generates a custom "Verdict", "Nutrition Score", and suitability checks for specific groups (Diabetes, Heart Health, Children).
* **Modular Architecture:** Clean, separated code structure for easy maintenance and scaling.

## Tech Stack

* **Framework:** FastAPI (Python)
* **AI Model:** Google Gemini 1.5 Flash (via `google-genai` SDK)
* **Data Source:** OpenFoodFacts API
* **Server:** Uvicorn
* **Utilities:** Pydantic, Requests, Python-Multipart

## 📂 Project Structure

```text
📦 backend
 ┣ 📜 main.py           # Application entry point & API routes
 ┣ 📜 services.py       # Business logic (AI calls, OpenFoodFacts integration)
 ┣ 📜 config.py         # Configuration & Model management
 ┣ 📜 utils.py          # Helper functions (Text cleaning, Formatting)
 ┣ 📜 .env              # Environment variables (API Keys)
 ┣ 📜 requirements.txt  # Project dependencies
 ┗ 📜 README.md         # Documentation
```

## Installation & Setup
1. Clone the Repository
```Bash

git clone [https://github.com/ShadowLegend007/IIT_Guwahati.git](https://github.com/ShadowLegend007/IIT_Guwahati.git)
cd incognito/backend
```
2. Create a Virtual Environment (Recommended)
```Bash

# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```
3. Install Dependencies
```Bash

pip install -r requirements.txt
```
4. Configure Environment Variables
Create a file named .env in the root directory and add your keys:

```Ini, TOML

# .env file
GOOGLE_API_KEY="your_actual_gemini_api_key_here"
HOST="127.0.0.1"
PORT=8000
```
Note: You can get a free API key from [Google AI Studio](https://aistudio.google.com/api-keys).

5. Run the Server
   for single time
```Bash
python main.py
```

for auto reloading server

```Bash
uvicorn main:app --reload
```

The server will start at http://127.0.0.1:8000

## API Usage
Endpoint: /analyze
Method: POST
ParameterTypeDescriptionproduct_namestringThe name of the food (e.g., "Oreo", "Apple"). Optional if image is provided.imagefileAn image of the product. The AI will identify the name from this image.
Example Request (cURL)
```Bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/analyze](http://127.0.0.1:8000/analyze)' \
  -F 'product_name=Horlicks'
  ```
Example Response (JSON Snippet)
```JSON
{
    "status": "success",
    "input": {
        "product_name": "krishna ghee",
        "input_type": "image",
        "image_provided": true
    },
    "product": {
        "name": "Udhaya Krishna Ghee 500ML",
        "brand": "Unknown",
        "category": "Unknown",
        "country": "en:france"
    },
    "marketing": {
        "labels": [],
        "claims": []
    },
    "images": {
        "input_image": {
            "filename": "",
            "file": {},
            "size": 0,
            "headers": {
                "content-disposition": "form-data; name=\"image\"; filename=\"\""
            },
            "_max_mem_size": 1048576
        },
        "reference_images": [
            "https://images.openfoodfacts.org/images/products/890/800/065/5119/front_fr.3.400.jpg",
            "",
            ""
        ],
        "source": "openfoodfacts"
    },
    "nutrition": {
        "per_100g": {
            "energy_kcal": 900,
            "protein_g": "0.1",
            "carbs_g": 0,
            "sugar_g": 0,
            "fat_g": 14,
            "sat_fat_g": "8.9",
            "sodium_mg": 0.0
        },
        "source_url": "[https://world.openfoodfacts.org/product/](https://world.openfoodfacts.org/product/)8908000655119",
        "data_confidence": "high"
    },
    "verdict": {
        "label": "occasionally_safe",
        "headline": "OCCASIONALLY SAFE",
        "subtext": "Ghee is a highly calorie-dense fat. While it can be part of a healthy diet, daily large consumption should be avoided due to its high fat and calorie content."
    },
    "overall_score": {
        "percent": 55,
        "interpretation": "This product is a pure fat source, meaning it's very high in calories. It should be consumed in small, controlled portions to fit within a balanced daily diet."
    },
    "nutrition_score": {
        "grade": "C"
    },
    "key_takeaways": {
        "possible_concern": "Its extremely high calorie and fat content means it can easily contribute to excess energy intake if not consumed in very small quantities.",
        "generally_safe": "As a traditional fat source, ghee is generally safe when used sparingly in cooking or as a flavour enhancer.",
        "depends_on_use": "The suitability of this product largely depends on the portion size and frequency of consumption within your overall dietary plan."
    },
    "age_suitability": {
        "children_0_12": "Can be included in small amounts to add energy to meals, but excessive intake should be avoided due to high calorie density.",
        "young_12_45": "Suitable in moderation as part of a balanced diet; mindful portion control is important due to high fat and calorie content.",
        "adults_45_plus": "Can be consumed in small quantities, but individuals should be particularly mindful of overall fat and calorie intake for heart health and weight management."
    },
    "health_suitability": {
        "diabetes": "As it contains no sugar, it won't directly impact blood sugar, but the high calorie content should be considered for overall energy balance.",
        "heart": "Due to its high fat content, including saturated fat, individuals concerned with heart health should consume it in strict moderation.",
        "weight": "Extremely high in calories per gram, making portion control vital for those managing or trying to lose weight.",
        "normal": "Generally safe for individuals with normal health when consumed in small, controlled portions as part of a varied diet."
    },
    "ai_opinion": {
        "text": "Ghee is a traditional source of fat that is very calorie-dense. While it can be incorporated into a balanced diet, it is crucial to use it in small quantities due to its high fat and calorie content to avoid excessive energy intake. As ingredients and processing levels are unknown, choosing a reputable brand is advisable."
    },
    "meta": {
        "data_source": "OpenFoodFacts",
        "analysis_type": "AI-interpreted",
        "confidence_level": "medium"
    }
}
```

## Contributing
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License
Distributed under the MIT License. See LICENSE for more information.