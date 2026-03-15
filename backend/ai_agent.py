import os, requests, json
from fastapi import APIRouter, Body, HTTPException

router = APIRouter()

CLAUDE_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

@router.post("/run")
def run_ai_agent(task: str = Body(..., embed=True)):
    api_key = os.getenv("CLAUDE_API_KEY")
    headers = {
        "x-api-key": api_key,
        "content-type": "application/json",
        "anthropic-version": ANTHROPIC_VERSION
    }

    system_message = (
        "You are an AI web developer inside the Atbott SaaS workspace. "
        "When the user asks you to create or generate a page, component, or UI, "
        "respond with a COMPLETE, self-contained HTML document wrapped in ```html code fences. "
        "The HTML must start with <!DOCTYPE html> and include <html>, <head>, <body> tags. "
        "Include all CSS inline in a <style> tag and all JS in a <script> tag. "
        "Do NOT use external CDN links unless specifically asked. "
        "Make the output visually polished with modern design. "
        "If the user asks a non-HTML question, respond normally in plain text."
    )

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 8192,
        "system": system_message,
        "messages": [
            {"role": "user", "content": task}
        ]
    }

    r = requests.post(CLAUDE_URL, headers=headers, json=data)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()
