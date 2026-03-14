import requests, json, re
from fastapi import APIRouter, Body

router = APIRouter()

BACKEND_URL = "http://localhost:8000"

def extract_json_from_text(text):
    """Extract JSON from Claude's response, handling markdown fences and surrounding text."""
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()

    match = re.search(r'(\[[\s\S]*\])', text)
    if match:
        return match.group(1).strip()

    match = re.search(r'(\{[\s\S]*\})', text)
    if match:
        return match.group(1).strip()

    return text.strip()

def flatten_actions(data):
    """Normalize Claude's varied JSON formats into a flat list of {action, path, content} dicts."""
    if isinstance(data, list):
        actions = []
        for item in data:
            actions.extend(flatten_actions(item))
        return actions

    if isinstance(data, dict):
        if "action" in data and "path" in data:
            return [data]

        results = []
        for key, value in data.items():
            if isinstance(value, list):
                for item in value:
                    if isinstance(item, dict) and "path" in item:
                        if "action" not in item:
                            item["action"] = "write"
                        results.append(item)
        return results

    return []

@router.post("/deploy")
def deploy_full_saas(idea: str = Body(..., embed=True)):
    """
    Phase 8 orchestrator: from SaaS idea → build → file creation → deploy
    """
    builder = requests.post(f"{BACKEND_URL}/ai_saas_builder/build", json={"idea": idea})
    if builder.status_code != 200:
        return {"error": "Builder failed", "details": builder.text}

    plan = builder.json()
    raw = plan.get("content", [{}])[0].get("text", "")

    cleaned = extract_json_from_text(raw)

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        if cleaned.startswith("["):
            truncated = cleaned
            while truncated and not truncated.endswith("]"):
                truncated = truncated.rsplit("}", 1)[0]
                if truncated:
                    truncated = truncated.rstrip(", \n\r\t") + "]"
                    try:
                        parsed = json.loads(truncated)
                        break
                    except json.JSONDecodeError:
                        truncated = truncated[:-1]
                        continue
            else:
                return {"error": "Claude returned non-JSON blueprint", "raw": raw[:500]}
        else:
            return {"error": "Claude returned non-JSON blueprint", "raw": raw[:500]}

    actions = flatten_actions(parsed)

    if not actions:
        return {"error": "No file actions found in Claude's response", "parsed": parsed}

    results = []
    for act in actions:
        action_type = act.get("action")
        if action_type == "write" and "path" in act and "content" in act:
            write_resp = requests.post(
                f"{BACKEND_URL}/ai_engine/write",
                json={"path": act["path"], "content": act["content"]}
            )
            results.append({"write": act["path"], "status": "done" if write_resp.status_code == 200 else "failed"})
        elif action_type == "read" and "path" in act:
            read_resp = requests.get(f"{BACKEND_URL}/ai_engine/read", params={"path": act["path"]})
            results.append({"read": act["path"], "snippet": read_resp.json().get("content", "")[:500]})

    return {"files_created": len(results), "executor_result": results, "status": "deployed"}
