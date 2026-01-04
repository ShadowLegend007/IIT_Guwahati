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
  "product": {
    "name": "Horlicks Classic Malt",
    "brand": "GSK",
    "category": "Beverages"
  },
  "verdict": {
    "label": "occasionally_safe",
    "headline": "OCCASIONALLY SAFE",
    "subtext": "High in sugar, best consumed in moderation."
  },
  "nutrition_score": {
    "grade": "C"
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