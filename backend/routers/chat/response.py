# routers/chat/response.py
from .decision_engine import trade_decision
from .explainers import explain_ema, explain_rsi, explain_bb

BASIC_HELP = """I can help with:
- Stock basics (what is stock/share/volume)
- Price, trend
- RSI, EMA12/EMA26, Bollinger Bands
- Your ML prediction trends (VS/S/M/L) + confidence
- A simple BUY/HOLD/SELL signal summary (informational)

Try:
- "What is stock?"
- "What is a share?"
- "What does bullish mean?"
- "What is overbought / oversold?"
- "Give me NEPSE snapshot"
- "NEPSE prediction"
- "What is the confidence level of NEPSE?"
- "Should I invest in NABIL this month?"
"""

def build_response(intent: str, ctx: dict, question: str) -> str:
    symbol = ctx.get("symbol", "")
    price = ctx.get("price", 0.0)
    vol = ctx.get("volume")
    rsi = ctx.get("rsi", 0.0)
    ema12 = ctx.get("ema12", 0.0)
    ema26 = ctx.get("ema26", 0.0)
    bb_u = ctx.get("bb_upper", 0.0)
    bb_l = ctx.get("bb_lower", 0.0)

    pred = ctx.get("prediction", {})     # dict from /predict
    tech = ctx.get("technical", {})      # dict from technical_status()
    conf = float(pred.get("confidence", 0) or 0)

    q = (question or "").lower().strip()

    # ---------------------------
    # QUICK HANDLERS (always)
    # ---------------------------
    if "overbought" in q or "oversold" in q:
        return (
            "Overbought / Oversold usually refers to RSI:\n"
            "- RSI > 70 = often overbought (price moved up too fast)\n"
            "- RSI < 30 = often oversold (price dropped too fast)\n"
            "It’s not a guarantee—just a signal."
        )

    # ---------------------------
    # CONCEPT
    # ---------------------------
    if intent == "CONCEPT":
        if "volume" in q:
            return (
                "Volume means how many shares were traded in a time period.\n"
                "Higher volume = stronger interest (more buyers/sellers).\n"
                "Lower volume = weak interest, signals can be less reliable."
            )
        if "bullish" in q:
            return "Bullish means price is generally moving up (uptrend)."
        if "bearish" in q:
            return "Bearish means price is generally moving down (downtrend)."
        if "stock" in q or "share" in q:
            return (
                "A stock (share) means you own a small part of a company.\n"
                "Price changes because buyers and sellers trade it.\n"
                "Indicators like RSI/EMA/Bollinger help understand trend and momentum."
            )
        return "Ask me stock basics like: stock, share, volume, bullish/bearish, RSI, EMA."

    # ---------------------------
    # EXPLAIN INDICATORS
    # ---------------------------
    if any(x in q for x in ["what is rsi", "explain rsi", "rsi meaning"]):
        return (
            "RSI (Relative Strength Index) measures momentum from 0–100.\n"
            "- Above 70: often overbought\n"
            "- Below 30: often oversold\n"
            "- Between: neutral/normal"
        )

    if any(x in q for x in ["what is ema", "explain ema", "ema meaning"]):
        return (
            "EMA (Exponential Moving Average) follows price trend with more weight on recent days.\n"
            "- EMA12 reacts faster\n"
            "- EMA26 reacts slower\n"
            "- EMA12 > EMA26 often means bullish momentum"
        )

    if any(x in q for x in ["what is bollinger", "explain bollinger", "bb meaning"]):
        return (
            "Bollinger Bands measure volatility.\n"
            "- Upper/Lower bands around a moving average\n"
            "- Price near upper band: strong move (sometimes overextended)\n"
            "- Price near lower band: weak move (sometimes oversold)"
        )

    # ---------------------------
    # CONFIDENCE
    # ---------------------------
    if intent == "CONFIDENCE":
        return f"{symbol} ML confidence is {conf:.1f}% (higher = stronger prediction signal)."

    # ---------------------------
    # BUY / SELL
    # ---------------------------
    if intent == "BUY_SELL":
        # If symbol is missing/empty, ask user clearly
        if not symbol:
            return "Which stock symbol do you mean? Example: NABIL or NEPSE."

        decision = trade_decision(ctx)

        invest_hint = ""
        if any(x in q for x in ["invest", "this month", "buy now", "5000", "now", "today"]):
            invest_hint = (
                "\n\nIf you mean “invest this month”, one safer approach is:\n"
                "- Split into 2–4 smaller buys\n"
                "- Avoid buying when RSI is overbought (>70)\n"
                "- Prefer when EMA12 > EMA26 and ML trend is Uptrend\n"
                "(Informational only.)"
            )

        return (
            "I can’t give personal financial advice, but here’s a signal summary based on your ML prediction:\n"
            f"- ML trend: VS={pred.get('very_short_term')}, S={pred.get('short_term')}, "
            f"M={pred.get('mid_term')}, L={pred.get('long_term')} (confidence {conf:.1f}%)\n"
            f"- Suggestion (rule-based): **{decision}**\n\n"
            "Confirmation indicators:\n"
            f"- EMA: {explain_ema(ema12, ema26)}\n"
            f"- RSI: {explain_rsi(rsi)}\n"
            f"- Bollinger: {explain_bb(price, bb_u, bb_l)}\n"
            f"- Technical status: {tech}"
            f"{invest_hint}"
        )

    # ---------------------------
    # PREDICTION
    # ---------------------------
    if intent == "PREDICTION":
        return (
            f"{symbol} prediction:\n"
            f"Very short (3d): {pred.get('very_short_term')}\n"
            f"Short (7d): {pred.get('short_term')}\n"
            f"Mid (20d): {pred.get('mid_term')}\n"
            f"Long (60d): {pred.get('long_term')}\n"
            f"Confidence: {conf:.1f}%"
        )

    # ---------------------------
    # TECHNICAL
    # ---------------------------
    if intent == "TECHNICAL":
        return (
            f"{symbol} technical indicators:\n"
            f"- RSI: {explain_rsi(rsi)}\n"
            f"- EMA12/EMA26: {ema12:.2f} / {ema26:.2f}\n"
            f"- Bollinger Upper/Lower: {bb_u:.2f} / {bb_l:.2f}\n"
            f"- Technical status: {tech}"
        )

    # ---------------------------
    # DEFAULT SNAPSHOT
    # ---------------------------
    vol_text = f"\nVolume: {vol:.0f}" if vol is not None else "\nVolume: (not available in DB)"

    return (
        f"{symbol} snapshot:\n"
        f"Price: {price:.2f}{vol_text}\n"
        f"RSI: {explain_rsi(rsi)}\n"
        f"EMA: {explain_ema(ema12, ema26)}\n"
        f"Bollinger: {explain_bb(price, bb_u, bb_l)}\n"
        f"ML trend: VS={pred.get('very_short_term')}, S={pred.get('short_term')}, "
        f"M={pred.get('mid_term')}, L={pred.get('long_term')} (confidence {conf:.1f}%)"
    )
