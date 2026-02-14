# routers/chat/intent.py

INTENTS = {
    "BUY_SELL": [
        "should i buy", "can i buy", "buy now", "buy this month",
        "should i sell", "can i sell", "sell now",
        "hold or sell", "should i hold", "should i wait", "buy or wait",
        "invest", "investment", "enter", "exit", "entry", "leave"
    ],
    "PREDICTION": ["prediction", "forecast", "future", "next"],
    "TECHNICAL": ["rsi", "ema", "bollinger", "indicator", "overbought", "oversold"],
    "CONFIDENCE": ["confidence", "confidence level"],
    "CONCEPT": ["what is stock", "what is a stock", "what is share", "what is a share",
                "bullish", "bearish", "volume", "trading volume"],
    "SNAPSHOT": ["snapshot", "summary", "status", "current", "today"]
}

def normalize(q: str) -> str:
    q = q.lower().strip()
    # common typos users do
    q = q.replace("exist", "exit")     # user typed "exist" but meant "exit"
    q = q.replace("exits", "exit")
    return q

def detect_intent(question: str) -> str:
    q = normalize(question)

    for intent, keys in INTENTS.items():
        if any(k in q for k in keys):
            return intent

    # if they mention buy/sell/hold words anywhere, force BUY_SELL
    if any(w in q for w in ["buy", "sell", "hold", "wait", "invest", "entry", "exit"]):
        return "BUY_SELL"

    return "SNAPSHOT"
