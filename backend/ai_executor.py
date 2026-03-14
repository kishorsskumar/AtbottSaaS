import os, json, requests
from fastapi import APIRouter, Body

router = APIRouter()

BACKEND_BASE = "http://localhost:8000/ai_engine"

def read_file(path):
    return requests.get(f"{BACKEND_BASE}/read", params={"path": path}).json()["content"]

def write_file(path, content):
    requests.post(f"{BACKEND_BASE}/write", json={"path": path, "content": content})

@router.post("/execute")
def execute_task(task: str = Body(..., embed=True)):
    """
    Send an autonomous modification task to Claude. Claude will read, edit and write files automatically.
    """
    api_key = os.getenv("CLAUDE_API_KEY")
    headers = {
        "x-api-key": api_key,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01"
    }

    system_message = (
        "You are an autonomous software engineer inside the Atbott SaaS Project environment. "
        "Use only JSON responses with an 'action' field. "
        "Example actions:\n"
        "{'action':'read','path':'backend/main.py'} or "
        "{'action':'write','path':'backend/newfile.py','content':'<code>'}. "
        "You can chain multiple steps by returning a JSON array. Never run external commands. "
        "Return ONLY valid JSON, no markdown or explanation."
    )

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 600,
        "system": system_message,
        "messages": [
            {"role": "user", "content": task}
        ]
    }

    claude_response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data).json()
    text = claude_response.get("content", [{}])[0].get("text", "")

    import re
    cleaned = text.strip()
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned)
    cleaned = re.sub(r'\s*```$', '', cleaned)
    cleaned = cleaned.strip()

    try:
        actions = json.loads(cleaned)
        if isinstance(actions, dict):
            actions = [actions]
    except Exception:
        return {"error": "Claude returned non-JSON response", "raw": text}

    results = []
    for act in actions:
        typ = act.get("action")
        if typ == "read":
            content = read_file(act["path"])
            results.append({"read": act["path"], "snippet": content[:500]})
        elif typ == "write":
            write_file(act["path"], act["content"])
            results.append({"write": act["path"], "status": "done"})
    return {"steps": results, "claude_reply": text}
