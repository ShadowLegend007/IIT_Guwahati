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