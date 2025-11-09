# backend/verifier.py
import wikipedia
from sentence_transformers import SentenceTransformer, util
import spacy

# load models once
EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")  # small & fast
NLP = spacy.load("en_core_web_sm")

def search_wikipedia(query):
    try:
        titles = wikipedia.search(query, results=3)
        if not titles:
            return None
        page = wikipedia.page(titles[0], auto_suggest=False)
        return {
            "title": page.title,
            "summary": page.summary,
            "url": page.url
        }
    except Exception:
        # fallback: try first search result or return None
        try:
            titles = wikipedia.search(query)
            if not titles:
                return None
            page = wikipedia.page(titles[0])
            return {"title": page.title, "summary": page.summary, "url": page.url}
        except Exception:
            return None

def ner_overlap(a_text, b_text):
    ents_a = {ent.text.lower() for ent in NLP(a_text).ents}
    ents_b = {ent.text.lower() for ent in NLP(b_text).ents}
    if not (ents_a or ents_b):
        return 0.0
    overlap = len(ents_a & ents_b) / max(1, len(ents_a | ents_b))
    return overlap

def verify_answer(query, ai_answer, similarity_threshold=0.60, ner_threshold=0.18):
    """
    Returns a verification dict with fields:
      - status: likely_correct | possible_hallucination | no_reference_found
      - similarity: float (0..1) cosine sim
      - ner_overlap: float (0..1)
      - reference_title, reference_url, reference_summary
    """
    ref = search_wikipedia(query)
    if not ref:
        return {"status":"no_reference_found", "reason":"no_wikipedia_result"}
    summary = ref["summary"]
    # embeddings similarity
    emb_ai = EMBED_MODEL.encode(ai_answer, convert_to_tensor=True)
    emb_sum = EMBED_MODEL.encode(summary, convert_to_tensor=True)
    sim = util.cos_sim(emb_ai, emb_sum).item()
    ner_score = ner_overlap(ai_answer, summary)
    status = "likely_correct" if (sim >= similarity_threshold or ner_score >= ner_threshold) else "possible_hallucination"
    return {
        "status": status,
        "similarity": float(sim),
        "ner_overlap": float(ner_score),
        "reference_title": ref["title"],
        "reference_url": ref["url"],
        "reference_summary": summary
    }
