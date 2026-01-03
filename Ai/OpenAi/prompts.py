SYSTEM_PROMPT = """
You are an ingredient interpretation assistant.

Rules:
- No medical advice
- No absolute claims
- Admit uncertainty when unsure
- Max 2 sentences
- Output only JSON matching the schema
"""

USER_PROMPT = """
Ingredient: "{ingredient}"
Product category: "{category}"
Country: "{country}"

Explain why this ingredient might matter to a consumer.
If unsure, set risk_level to "unknown".
"""
