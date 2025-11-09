# backend/ai_model.py
import os

def get_ai_answer(query: str) -> str:
    """
    Returns an AI-generated answer string for the query.
    Uses OpenAI if OPENAI_API_KEY is set; otherwise falls back to a local HF model.
    """
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    if OPENAI_API_KEY:
        import openai
        openai.api_key = OPENAI_API_KEY
        resp = openai.Completion.create(
            model="text-davinci-003",
            prompt=query,
            max_tokens=250,
            temperature=0.2
        )
        return resp["choices"][0]["text"].strip()
    else:
        # Local fallback (smaller model; CPU-friendly-ish)
        from transformers import pipeline
        generator = pipeline("text2text-generation", model="google/flan-t5-small")
        out = generator(query, max_length=200)
        return out[0]["generated_text"].strip()
