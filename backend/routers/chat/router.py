# routers/chat/router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

from .domain_guard import is_stock_question
from .intent import detect_intent
from .context_builder import build_stock_context
from .response import build_response

router = APIRouter(prefix="/api", tags=["Chat"])

class ChatRequest(BaseModel):
    question: str
    symbol: str
    timeframe: Optional[str] = "1Y"
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    reply: str
    used_context: Dict[str, Any]

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    q = (req.question or "").strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question is required")

    intent = detect_intent(q)

    # ✅ CONCEPT questions do NOT need DB/predict at all
    if intent == "CONCEPT":
        reply = build_response(intent, {}, q)
        return {"reply": reply, "used_context": {}}

    # non-stock questions -> polite reject
    if not is_stock_question(q):
        return {
            "reply": "I can answer stock questions only (price, RSI, EMA, Bollinger, prediction, buy/sell signals). Try: 'NABIL snapshot' or 'Explain RSI'.",
            "used_context": {}
        }

    # build context only when needed
    ctx = build_stock_context(req.symbol, req.timeframe)
    if ctx is None:
        return {"reply": f"No data found for symbol {req.symbol}.", "used_context": {}}

    reply = build_response(intent, ctx, q)
    return {"reply": reply, "used_context": ctx}
