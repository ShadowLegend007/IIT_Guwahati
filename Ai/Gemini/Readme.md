# Food Health Analyzer API

An AI-powered backend service that evaluates packaged food products and explains whether they are suitable for daily consumption. The system combines factual data from OpenFoodFacts with human-readable interpretation generated using Google Gemini. Users can provide either a product name or an image of the product.

---

## Overview

Modern food labels present nutritional information in a way that is difficult for most users to interpret. This API focuses on reducing cognitive load by interpreting ingredients, additives, processing level, and nutritional quality to provide a clear verdict on food suitability.

The output is structured, concise, and designed to be directly consumed by frontend applications.

---

## Key Features

- Product lookup using OpenFoodFacts
- Image-based product identification using AI
- AI-generated health interpretation (non-medical)
- Structured and consistent JSON output
- FastAPI backend with Uvicorn server
- CORS enabled for cross-platform frontend integration

---

## System Architecture

1. User submits a product name or product image  
2. Image (if provided) is analyzed using Gemini Vision to infer product name  
3. Product data is fetched from OpenFoodFacts  
4. Nutrition, ingredients, additives, and processing level are interpreted using AI  
5. A structured JSON response is returned to the client  

---

## Technology Stack

- **Backend Framework**: FastAPI  
- **AI Model**: Google Gemini 1.5 Flash  
- **Food Database**: OpenFoodFacts  
- **Server**: Uvicorn  
- **Environment Management**: python-dotenv  

---

## Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/food-health-analyzer.git
cd food-health-analyzer