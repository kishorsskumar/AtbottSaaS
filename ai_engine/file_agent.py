import os, json
from fastapi import APIRouter, HTTPException, Body

router = APIRouter()

WORKSPACE_DIR = os.path.abspath(".")

@router.get("/list")
def list_files(path: str = ""):
    """List files and folders in the given workspace path."""
    target = os.path.join(WORKSPACE_DIR, path)
    if not os.path.exists(target):
        raise HTTPException(status_code=404, detail="Path not found")
    items = os.listdir(target)
    return {"path": path, "items": items}

@router.get("/read")
def read_file(path: str):
    """Read the contents of a file."""
    target = os.path.join(WORKSPACE_DIR, path)
    if not os.path.isfile(target):
        raise HTTPException(status_code=404, detail="File not found")
    with open(target, "r", encoding="utf-8") as f:
        return {"path": path, "content": f.read()}

@router.post("/write")
def write_file(path: str = Body(...), content: str = Body(...)):
    """Write or create a file with the given content."""
    target = os.path.join(WORKSPACE_DIR, path)
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        f.write(content)
    return {"success": True, "path": path}
