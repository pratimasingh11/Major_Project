# routers/chat/decision_engine.py

def decision_from_prediction(pred: dict) -> str:
    """
    Decide BUY/HOLD/SELL mainly from LSTM derived prediction trends.
    Uses:
    - trends: very_short_term, short_term, mid_term, long_term (Uptrend/Downtrend/Sideways)
    - confidence: 0-100
    """
    conf = float(pred.get("confidence", 0))

    # confidence too low -> don't give strong call
    if conf < 55:
        return "HOLD"

    trends = [
        pred.get("very_short_term"),
        pred.get("short_term"),
        pred.get("mid_term"),
        pred.get("long_term"),
    ]

    up = sum(1 for t in trends if t == "Uptrend")
    down = sum(1 for t in trends if t == "Downtrend")
    side = sum(1 for t in trends if t == "Sideways")

    # Strong bias logic
    if up >= 3 and down == 0:
        return "BUY"
    if down >= 3 and up == 0:
        return "SELL"

    # Mixed trends -> HOLD
    if side >= 2:
        return "HOLD"

    # Slight bias
    if up > down:
        return "BUY"
    if down > up:
        return "SELL"
    return "HOLD"


def trade_decision(ctx, horizon="1M"):
    """
    Final decision uses derived prediction as PRIMARY,
    and uses EMA/RSI/technical status as confirmation.
    """
    pred_decision = decision_from_prediction(ctx["prediction"])

    # confirmation score (secondary)
    confirm = 0
    if ctx["ema12"] > ctx["ema26"]:
        confirm += 1
    if 40 < ctx["rsi"] < 70:
        confirm += 1
    if ctx["technical"].get("short_term") == "Uptrend":
        confirm += 1

    # If prediction says BUY but confirmation looks bearish, reduce to HOLD
    if pred_decision == "BUY" and confirm == 0:
        return "HOLD"

    # If prediction says SELL but confirmation looks bullish, reduce to HOLD
    if pred_decision == "SELL" and confirm >= 2:
        return "HOLD"

    return pred_decision
