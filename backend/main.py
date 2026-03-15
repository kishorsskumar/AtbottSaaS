from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import os, requests
from ai_engine import file_agent
from backend import ai_agent
from backend import ai_executor
from backend import ai_saas_builder
from backend import ai_orchestrator
from backend.projects import manager as project_manager
from backend import collaboration

app = FastAPI(title="Atbott SaaS Project API")

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

app.include_router(file_agent.router, prefix="/ai_engine", tags=["AI File Engine"])
app.include_router(ai_agent.router, prefix="/ai_agent", tags=["Claude AI Agent"])
app.include_router(ai_executor.router, prefix="/ai_executor", tags=["AI Executor"])
app.include_router(ai_saas_builder.router, prefix="/ai_saas_builder", tags=["SaaS Auto Builder"])
app.include_router(ai_orchestrator.router, prefix="/ai_orchestrator", tags=["SaaS Deployment Orchestrator"])
app.include_router(project_manager.router, prefix="/projects", tags=["Project Manager"])
app.include_router(collaboration.router, prefix="", tags=["Team Collaboration"])

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
