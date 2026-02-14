# routers/chat/domain_guard.py

STOCK_KEYWORDS = {
    "stock","share","price","buy","sell","hold","trend","rsi","ema",
    "bollinger","prediction","forecast","market","bullish","bearish",
    "support","resistance","candle","technical","indicator",
    "invest","investment","entry","exit",
    "snapshot","confidence","overbought","oversold","volume"
}

def is_stock_question(question: str) -> bool:
    q = question.lower()
    return any(k in q for k in STOCK_KEYWORDS)
