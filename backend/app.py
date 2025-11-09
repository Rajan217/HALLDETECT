from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import spacy
import wikipedia

app = Flask(__name__)
CORS(app)

# Load NLP and QA models
nlp = spacy.load("en_core_web_sm")
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route("/")
def home():
    return jsonify({"message": "Backend is working! 🚀"})

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Empty query"}), 400

    # Step 1: Try to find a relevant Wikipedia page
    wiki_page = None
    context = ""
    try:
        title = wikipedia.search(query, results=1)
        if title:
            wiki_page = wikipedia.page(title[0], auto_suggest=True, redirect=True)
            context = wiki_page.content[:1500]  # use first 1500 characters for context
    except Exception:
        pass

    # Step 2: Generate AI answer using QA model (or fallback)
    ai_answer = "Sorry, I could not find enough information."
    if context:
        try:
            result = qa_pipeline(question=query, context=context)
            ai_answer = result["answer"]
        except Exception:
            pass

    # Step 3: Simple similarity and NER-based validation
    doc = nlp(query)
    entities = [ent.text for ent in doc.ents]

    similarity = 0.8 if ai_answer.lower() in context.lower() else 0.3
    ner_overlap = len(entities) / max(len(doc), 1)

    if similarity > 0.7 and ner_overlap > 0.2:
        status = "likely_correct"
    elif similarity < 0.4 or ner_overlap < 0.1:
        status = "possible_hallucination"
    else:
        status = "no_reference_found"

    # Step 4: Try to generate a corrected version if hallucination detected
    corrected_answer = None
    if status == "possible_hallucination" and context:
        try:
            # Summarize the reliable Wikipedia content to produce a corrected version
            summary = summarizer(context, max_length=100, min_length=40, do_sample=False)[0]["summary_text"]
            corrected_answer = summary
        except Exception:
            corrected_answer = "Unable to auto-correct due to limited reference data."

    # Step 5: Package verification result
    verification = {
        "status": status,
        "similarity": similarity,
        "ner_overlap": ner_overlap,
        "reference_url": wiki_page.url if wiki_page else None,
        "reference_title": wiki_page.title if wiki_page else None,
        "reference_summary": context[:400] if wiki_page else None
    }

    return jsonify({
        "ai_answer": ai_answer,
        "verification": verification,
        "corrected_answer": corrected_answer
    })

if __name__ == "__main__":
    app.run(debug=True)
