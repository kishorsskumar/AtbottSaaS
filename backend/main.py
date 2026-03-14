from fastapi import FastAPI
from pydantic import BaseModel
import os, requests

app = FastAPI(title="Atbott SaaS Project API")

class Prompt(BaseModel):
    message: str

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

@app.post("/generate")
def generate(prompt: Prompt):
    headers = {
        "x-api-key": CLAUDE_API_KEY,
        "content-type": "application/json"
    }
    data = {
        "model": "claude-3-5-sonnet-20240620",
        "messages": [
            {"role": "user", "content": prompt.message}
        ]
    }
    resp = requests.post(
        "[api.anthropic.com](https://api.anthropic.com/v1/messages)",
        headers=headers,
        json=data
    )
    return resp.json()
