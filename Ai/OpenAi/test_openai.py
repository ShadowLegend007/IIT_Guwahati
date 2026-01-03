from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a test assistant."},
        {"role": "user", "content": "Say hello in one sentence."}
    ]
)

print(response.choices[0].message.content)
