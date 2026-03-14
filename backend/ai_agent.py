import os, requests, json
from fastapi import APIRouter, Body, HTTPException

router = APIRouter()

CLAUDE_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

@router.post("/run")
def run_ai_agent(task: str = Body(..., embed=True)):
    """
    Send a request to Claude to perform a development task that may involve file reading/writing.
    """
    api_key = os.getenv("CLAUDE_API_KEY")
    headers = {
        "x-api-key": api_key,
        "content-type": "application/json",
        "anthropic-version": ANTHROPIC_VERSION
    }

    system_message = (
        "You are an autonomous software engineer inside the Atbott SaaS Project environment. "
        "You can read and write files via the provided HTTP API endpoints at /ai_engine. "
        "Use JSON commands like {action:'read', path:'...'} or {action:'write', path:'...', content:'...'} "
        "to update files. Always keep valid Python/JS syntax when editing code."
    )

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 500,
        "system": system_message,
        "messages": [
            {"role": "user", "content": task}
        ]
    }

    r = requests.post(CLAUDE_URL, headers=headers, json=data)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()
