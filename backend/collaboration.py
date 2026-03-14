from fastapi import WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter
from typing import List

router = APIRouter()
active_connections: List[WebSocket] = []

@router.websocket("/collab/ws")
async def collab_endpoint(ws: WebSocket):
    await ws.accept()
    active_connections.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            for conn in active_connections:
                if conn is not ws:
                    await conn.send_text(data)
    except WebSocketDisconnect:
        active_connections.remove(ws)
