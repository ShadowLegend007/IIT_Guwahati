from ai.ai_interpreter import interpret_ingredient_ai

def analyze_product(product: dict):
    insights = []

    for ingredient in product["ingredients"]:
        insight = interpret_ingredient_ai(
            ingredient=ingredient,
            category=product.get("category"),
            country=product.get("country")
        )
        insight["ingredient"] = ingredient
        insights.append(insight)

    return {
        "product_name": product["product_name"],
        "summary": generate_summary(insights),
        "insights": insights
    }
