from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from firebase_admin_config import get_firestore_db
from models.schemas import ChatMessage, ChatSessionCreate, ChatSessionResponse
from routes.auth import verify_token
from typing import List
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["Chat"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)

    async def send_message(self, message: dict, session_id: str):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass


manager = ConnectionManager()


@router.post("/sessions", response_model=ChatSessionResponse)
async def create_chat_session(session: ChatSessionCreate, user=Depends(verify_token)):
    db = get_firestore_db()
    session_data = {
        "customerId": session.customerId,
        "customerName": session.customerName,
        "agentId": None,
        "status": "active",
        "createdAt": datetime.utcnow().isoformat(),
    }

    doc_ref = db.collection("chat_sessions").add(session_data)
    session_id = doc_ref[1].id

    # Send bot greeting
    greeting = {
        "sender": "bot",
        "text": f"Welcome {session.customerName}! How can we help you today?",
        "timestamp": datetime.utcnow().isoformat(),
    }
    db.collection("chat_sessions").document(session_id).collection("messages").add(greeting)

    return ChatSessionResponse(id=session_id, **session_data)


@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(user=Depends(verify_token)):
    db = get_firestore_db()
    role = user.get("role", "customer")
    uid = user["uid"]

    if role == "admin" or role == "moderator":
        query = db.collection("chat_sessions").where("status", "==", "active")
    else:
        query = db.collection("chat_sessions").where("customerId", "==", uid)

    docs = query.order_by("createdAt", direction="DESCENDING").stream()
    sessions = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        sessions.append(ChatSessionResponse(**data))

    return sessions


@router.get("/sessions/{session_id}/messages")
async def get_chat_messages(session_id: str, user=Depends(verify_token)):
    db = get_firestore_db()
    docs = (
        db.collection("chat_sessions")
        .document(session_id)
        .collection("messages")
        .order_by("timestamp")
        .stream()
    )

    messages = []
    for doc in docs:
        msg = doc.to_dict()
        msg["id"] = doc.id
        messages.append(msg)

    return messages


@router.post("/sessions/{session_id}/messages")
async def send_chat_message(session_id: str, message: ChatMessage, user=Depends(verify_token)):
    db = get_firestore_db()
    session_doc = db.collection("chat_sessions").document(session_id).get()
    if not session_doc.exists:
        raise HTTPException(status_code=404, detail="Chat session not found")

    message_data = message.model_dump()
    message_data["timestamp"] = datetime.utcnow().isoformat()

    db.collection("chat_sessions").document(session_id).collection("messages").add(message_data)

    await manager.send_message(message_data, session_id)

    return {"message": "Message sent"}


@router.put("/sessions/{session_id}/assign")
async def assign_agent(session_id: str, user=Depends(verify_token)):
    if user.get("role") not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Moderator access required")

    db = get_firestore_db()
    db.collection("chat_sessions").document(session_id).update({
        "agentId": user["uid"],
        "status": "active",
    })

    return {"message": "Agent assigned successfully"}


@router.put("/sessions/{session_id}/close")
async def close_chat_session(session_id: str, user=Depends(verify_token)):
    db = get_firestore_db()
    db.collection("chat_sessions").document(session_id).update({"status": "closed"})
    return {"message": "Chat session closed"}


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            import json
            message = json.loads(data)

            db = get_firestore_db()
            message["timestamp"] = datetime.utcnow().isoformat()
            db.collection("chat_sessions").document(session_id).collection("messages").add(message)

            await manager.send_message(message, session_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
