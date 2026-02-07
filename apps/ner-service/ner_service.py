from fastapi import FastAPI
from pydantic import BaseModel
import spacy

nlp = spacy.load("en_core_web_sm")

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.get("/")
def root():
    return {"status": "API is running"}    

@app.post("/extract-entities")
def extract_entities(input: TextInput):
    doc = nlp(input.text)

    entities = []
    for ent in doc.ents:
        entities.append({
            "text": ent.text,
            "label": ent.label_,
            "start": ent.start_char,
            "end": ent.end_char,
            "confidence": 0.85  # spaCy doesn't expose prob; fixed for v1
        })

    return { "entities": entities }
