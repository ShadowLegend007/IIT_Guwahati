# 🕵️‍♂️ Incognito - AI Food Health Analyzer

![Incognito Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge) ![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white) ![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-8E75B2?style=for-the-badge)

**By Team INCOGNITO**

Incognito is an intelligent, AI-driven application designed to decode product ingredients instantly. It acts as a co-pilot for consumers, combining real-world database data (OpenFoodFacts) with Generative AI (Google Gemini) to interpret food labels like a nutritionist.

---

## ✨ Features

### 🧠 Hybrid Analysis Engine
- **Packaged Foods**: Fetches accurate nutritional data from OpenFoodFacts and uses AI to interpret the health impact.
- **Natural Foods**: Uses AI's internal knowledge base to estimate nutrition for raw items (e.g., "Apple", "Banana") where barcodes don't exist.

### 🔍 Smart Detection
- **Smart Classification**: Automatically detects if an input is a Natural Food, Packaged Food, or Non-Food item.
- **Image Recognition**: Users can upload an image of a product, and the system will identify the product name and brand automatically.

### 📊 Health Insights
- **Health Scoring**: Generates a custom "Verdict", "Nutrition Score", and suitability checks.
- **Age-Specific Advice**: Tailored recommendations for Adults, Teens, Children, and Babies.
- **Visual Narratives**: Beautiful, data-rich visualizations including pie charts and safety meters.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: Google Gemini 1.5 Flash
- **Data Source**: OpenFoodFacts API
- **Server**: Uvicorn

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React

---

## 📂 Project Structure

```bash
Code/Incognito
├── Backend/               # FastAPI Service
│   ├── main.py            # Application entry point & Routes
│   ├── services.py        # Business logic (AI & Data calls)
│   ├── config.py          # Configuration & Models
│   ├── utils.py           # Helper functions
│   ├── .env               # Environment variables
│   └── requirements.txt   # Backend dependencies
│
└── Frontend/              # React Application
    ├── src/
    │   ├── app/           # Components & Pages
    │   ├── styles/        # Global styles
    │   ├── api.ts         # API integration & Types
    │   └── main.tsx       # Frontend entry point
    ├── tailwind.config.js # Styling Config
    ├── vite.config.ts     # Vite Config
    └── package.json       # Frontend dependencies
```

---

## 🚀 Getting Started

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd Code/Incognito/Backend
```

Create environment file `.env` and add your keys:
```env
GOOGLE_API_KEY="your_gemini_api_key_here"
HOST="127.0.0.1"
PORT=8000
```

Install dependencies and run the server:
```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
*Server runs at: `http://127.0.0.1:8000`*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd Code/Incognito/Frontend
```
Create environment file `.env` and add your keys:
```env
VITE_API_URL = "http://127.0.0.1:8000"
```

Install dependencies and start the app:
```bash
npm install
npm run dev
```
*App runs at: `http://localhost:5173` (usually)*

---

## 📡 API Usage

**Endpoint**: `POST /analyze`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `product_name` | string | Name of the food (e.g., "Oreo"). Optional if image provided. |
| `image` | file | Image of the product for auto-identification. |

**Example (cURL):**
```bash
curl -X 'POST' 'http://127.0.0.1:8000/analyze' -F 'product_name=Horlicks'
```

---

## 👥 Meet the Team

| Role | Member | GitHub |
| :--- | :--- | :--- |
| **Team Lead** | Rajdeep | [@Rajdeep2302](https://github.com/Rajdeep2302) |
| **ML Expert** | Akash Saha | [@akashsaha477](https://github.com/akashsaha477) |
| **Frontend** | Subhodeep | [@ShadowLegend007](https://github.com/ShadowLegend007) |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

&copy; 2026 Incognito. All rights reserved.
