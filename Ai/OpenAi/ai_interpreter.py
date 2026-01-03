import json
from openai import OpenAI
from ai.prompts import SYSTEM_PROMPT, USER_PROMPT


client = OpenAI()

def interpret_ingredient_ai(ingredient: str, context: dict):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT.format(
                ingredient=ingredient,
                category=context.get("category"),
                country=context.get("country")
            )}
        ],
        temperature=0.2
    )

    try:
        return json.loads(response.choices[0].message.content)
    except Exception:
        return {
            "risk_level": "unknown",
            "why_it_matters": "Unable to determine impact reliably.",
            "who_should_care": "No specific group identified.",
            "confidence": 0.2
        }
