import os
import json
import torch
from transformers import BertForSequenceClassification, BertTokenizer
import numpy as np
from openai import OpenAI
from rag_backend import *



def binary_classifier(tweet, model_path="./models/binary_model"):
    tokenizer = BertTokenizer.from_pretrained(model_path)
    model = BertForSequenceClassification.from_pretrained(model_path)
    device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    #tokenize input
    inputs = tokenizer(tweet, return_tensors="pt", padding=True, truncation=True, max_length=128)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        pred = torch.argmax(logits, dim=1).item()

    label_map = {1: "non-informative", 0: "informative"}
    return label_map[pred]


def humanitarianClassifier(tweet, model_path="./models/multi-class-humanitarian_model"):
    tokenizer = BertTokenizer.from_pretrained(model_path)
    model = BertForSequenceClassification.from_pretrained(model_path)
    device = torch.device("mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    #tokenize input
    inputs = tokenizer(tweet, return_tensors="pt", padding=True, truncation=True, max_length=128)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        pred = torch.argmax(logits, dim=1).item()
    
    label_map = {0:'affected_individuals', 1: 'infrastructure_and_utility_damage', 2: 'injured_or_dead_people', 3:'missing_or_found_people', 4: 'not_humanitarian', 5:'other_relevant_information',6:'rescue_volunteering_or_donation_effort', 7:'vehicle_damage'}
    return label_map[pred]

def categorize_tweet(tweet):
    info_category = binary_classifier(tweet)
    if info_category=="non-informative":
        return "This tweet doesn't contain any disaster related information."
    humanitarian_category = humanitarianClassifier(tweet)
    return info_category, humanitarian_category

def call_gpt_extractor(tweet, existing_summary=None):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt = f"""
    You are an expert in extracting structured information from tweets about disasters.
    Given the tweet and existing event summary, return a JSON with important details about the event.
    The JSON may include the following fields:
    - event_type
    - locations (seperated by comma)
    - people_killed (just number)
    - people_trapped (just number)
    - infrastructure_damage
    - any other details you find relevant
    - summary (updated, more detailed)
    - category (category mentioned at last of tweet)

    Tweet: "{tweet}"
    Existing Event Summary: "{existing_summary or 'None'}"

    Respond only in JSON format.
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )
    return response.choices[0].message.content

def DisasterExtraction(tweet):
    rag = RAGBackend()
    info_category = binary_classifier(tweet)
    if info_category=="non-informative":
        return "This tweet doesn't contain any disaster related information."
    humanitarian_category = humanitarianClassifier(tweet)
    tweet+= f", Category: {humanitarian_category}"
    gpt_response = call_gpt_extractor(tweet)
    result = rag.process_event(gpt_response)
    return result

