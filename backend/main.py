from fastapi import FastAPI
from pydantic import BaseModel
import os, requests
from ai_engine import file_agent

app = FastAPI(title="Atbott SaaS Project API")
app.include_router(file_agent.router, prefix="/ai_engine", tags=["AI File Engine"])

class Prompt(BaseModel):
    message: str

@app.post("/generate")
def generate(prompt: Prompt):
    api_key = os.getenv("CLAUDE_API_KEY")
    headers = {
        "x-api-key": api_key,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01"
    }
    data = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 300,
        "messages": [
            {"role": "user", "content": prompt.message}
        ]
    }
    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=data
        )
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import os, uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
