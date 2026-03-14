import os, json, requests
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/build")
def build_saas(idea: str = Body(..., embed=True)):
    """
    Orchestrate a new SaaS build based on blueprints and Claude reasoning.
    """
    api_key = os.getenv("CLAUDE_API_KEY")

    blueprints_dir = os.path.abspath("blueprints")
    blueprint_files = [f for f in os.listdir(blueprints_dir) if f.endswith(".json")]

    combined = []
    for f in blueprint_files:
        path = os.path.join(blueprints_dir, f)
        with open(path, "r", encoding="utf-8") as file:
            combined.append(json.load(file))

    system = (
        "You are an autonomous SaaS generator called Atbott Builder. "
        "You have JSON blueprints describing modules and you can use them to scaffold full SaaS projects. "
        "When I describe a business idea, choose the best blueprint modules, modify code paths if needed, "
        "and respond with ONLY a JSON array of write instructions. No explanation text, no markdown fences. "
        "Each item must be: {\"action\":\"write\",\"path\":\"...\",\"content\":\"...\"}. "
        "Keep file contents concise. Return ONLY valid JSON."
    )

    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 8192,
        "system": system,
        "messages": [
            {"role": "user", "content": f"Business Idea: {idea}\nBlueprints: {json.dumps(combined)}"}
        ]
    }

    headers = {
        "x-api-key": api_key,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01"
    }

    resp = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
    return resp.json()
