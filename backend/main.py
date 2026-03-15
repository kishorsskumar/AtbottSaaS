from fastapi import FastAPI
from fastapi.responses import HTMLResponse
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
    return HTMLResponse(content="""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>atBott SaaS – Your Trusted Digital Partner</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .hero { text-align: center; padding: 60px 20px; }
    .logo { font-size: 48px; font-weight: 800; color: #16A0C6; letter-spacing: -1px; }
    .logo span { color: #fff; }
    .tagline { font-size: 16px; color: #8b949e; margin-top: 6px; letter-spacing: 2px; text-transform: uppercase; }
    h1 { font-size: 36px; font-weight: 700; margin-top: 32px; line-height: 1.3; }
    h1 em { color: #16A0C6; font-style: normal; }
    p.desc { color: #8b949e; font-size: 16px; margin-top: 16px; max-width: 500px; line-height: 1.7; }
    .buttons { display: flex; gap: 16px; margin-top: 40px; justify-content: center; flex-wrap: wrap; }
    a.btn { padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; transition: opacity .2s; }
    a.btn-primary { background: #16A0C6; color: #fff; }
    a.btn-secondary { background: #21262d; color: #e6edf3; border: 1px solid #30363d; }
    a.btn:hover { opacity: 0.85; }
    .features { display: flex; gap: 20px; margin-top: 60px; flex-wrap: wrap; justify-content: center; max-width: 800px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; width: 220px; text-align: left; }
    .card-icon { font-size: 28px; margin-bottom: 12px; }
    .card h3 { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
    .card p { font-size: 13px; color: #8b949e; line-height: 1.6; }
    footer { margin-top: 60px; color: #484f58; font-size: 13px; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="logo">at<span>Bott</span></div>
    <div class="tagline">Your Trusted Digital Partner</div>
    <h1>Build <em>smarter</em> with AI-powered SaaS</h1>
    <p class="desc">atBott is an autonomous SaaS builder powered by Claude AI. Describe your idea, and watch it come to life — code, preview, deploy.</p>
    <div class="buttons">
      <a class="btn btn-primary" href="/docs">Explore API Docs</a>
      <a class="btn btn-secondary" href="/ai_agent/run">Try AI Agent</a>
    </div>
    <div class="features">
      <div class="card">
        <div class="card-icon">🧠</div>
        <h3>Claude AI Engine</h3>
        <p>Generate full pages, components, and apps from plain English prompts.</p>
      </div>
      <div class="card">
        <div class="card-icon">📁</div>
        <h3>AI File Engine</h3>
        <p>Read, write, and manage project files autonomously via the API.</p>
      </div>
      <div class="card">
        <div class="card-icon">🚀</div>
        <h3>SaaS Auto Builder</h3>
        <p>Scaffold complete projects from a business idea in seconds.</p>
      </div>
      <div class="card">
        <div class="card-icon">👥</div>
        <h3>Live Collaboration</h3>
        <p>Real-time WebSocket sync keeps your team editing in lockstep.</p>
      </div>
    </div>
  </div>
  <footer>&copy; 2026 atBott &mdash; Powered by Claude AI &amp; FastAPI</footer>
</body>
</html>""")

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
