import os
import random
import aiohttp
import asyncio
import spacy
from dotenv import load_dotenv
from rapidfuzz import process, fuzz

load_dotenv()

api_key = os.getenv("api_key")
azure_endpoint = "https://aasare-new.openai.azure.com/"
api_version = "2024-02-15-preview"

nlp = spacy.load("en_core_web_sm")

# read topics from a file
def read_topics_from_file(file_path):
    with open(file_path, 'r') as file:
        topics = file.read().splitlines()
    return [topic.strip().lower() for topic in topics]

# read blog links from a file
def read_blog_links_from_file(file_path):
    blogs = {}
    with open(file_path, 'r') as file:
        for line in file:
            topic, links = line.strip().split('|')
            blogs[topic.strip().lower()] = [link.strip() for link in links.split(',') if link.strip()]
    return blogs

# correct spellings
def correct_spelling(question, topics):
    words = question.split()
    corrected_words = []
    for word in words:
        best_match, score, _ = process.extractOne(word, topics, scorer=fuzz.ratio)
        if score > 60:  # Adjust the threshold as needed
            corrected_words.append(best_match)
        else:
            corrected_words.append(word)
    return ' '.join(corrected_words)

# get related topic
def get_related_topic(question, topics):
    question_lower = question.lower()
    for topic in topics:
        if topic in question_lower:
            return topic
    return None

# select a random blog link
def select_random_blog_link(topic, blogs):
    if topic in blogs:
        return random.choice(blogs[topic])
    else:
        return None

topics_file_path = os.path.join(os.path.dirname(__file__), 'topics.txt')
blogs_file_path = os.path.join(os.path.dirname(__file__), 'blogs.txt')

topics = read_topics_from_file(topics_file_path)
blogs = read_blog_links_from_file(blogs_file_path)

async def get_response(question):
    headers = {
        'Content-Type': 'application/json',
        'api-key': api_key,
    }
    data = {
        "model": "aasare-new",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": question},
        ]
    }
    # https://aasare-new.openai.azure.com/
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{azure_endpoint}openai/deployments/aasare-35/chat/completions?api-version={api_version}", headers=headers, json=data) as response:
            if response.status == 200:
                response_json = await response.json()
                return response_json['choices'][0]['message']['content']
            else:
                return None

async def chatbot_response(question):
    corrected_question = correct_spelling(question, topics)
    related_topic = get_related_topic(corrected_question, topics)
    response = await get_response(related_topic)
    
    if related_topic:
        return{
            "response": response
        }
    else:
        return{
            "response": "its not related to mental health"
        }