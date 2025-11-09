# backend/corrector.py
import os
import openai

def correct_hallucination(query, ai_answer, reference_summary):
    """
    Uses an LLM (e.g., OpenAI GPT) to rewrite the hallucinated AI answer
    based on factual reference data (Wikipedia summary).
    """

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set")

    openai.api_key = OPENAI_API_KEY

    prompt = f"""
The following AI answer appears to contain factual inaccuracies.

User query:
{query}

Incorrect AI answer:
{ai_answer}

Trusted reference information:
{reference_summary}

Task:
Rewrite the AI answer to make it factually correct and consistent with the reference. 
Keep the same style and tone, but fix the errors.
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",  # you can change to gpt-4 or gpt-3.5-turbo
        messages=[{"role": "user", "content": prompt}],
        max_tokens=250,
        temperature=0.3
    )

    corrected_text = response["choices"][0]["message"]["content"].strip()
    return corrected_text
