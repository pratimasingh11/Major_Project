# routers/chat/context_builder.py
import time
import pandas as pd

from core.database import get_db_connection
from routers.analysis import resample_data
from routers.predictions import predict
from routers.technical_status import technical_status

_CONTEXT_CACHE = {}
CACHE_TTL_SECONDS = 60

def build_stock_context(symbol: str, timeframe: str = "1Y"):
    sym = symbol.upper().strip()
    key = (sym, timeframe)
    now = time.time()

    if key in _CONTEXT_CACHE:
        ts, cached = _CONTEXT_CACHE[key]
        if now - ts < CACHE_TTL_SECONDS:
            return cached

    conn = get_db_connection()

    # Fetch only what you use (+ needed for resample_data)
    df = pd.read_sql(
        """
        SELECT date, symbol, open, high, low, close, close_norm
        FROM stocks
        WHERE symbol=%s
        ORDER BY date ASC
        """,
        conn,
        params=(sym,)
    )
    conn.close()

    if df.empty:
        return None

    df = resample_data(df, timeframe)
    latest = df.iloc[-1]

    # prediction() is now cached + model cached => fast
    pred = predict(sym)

    # you can also cache this inside technical_status() if needed
    tech = technical_status(sym)

    ctx = {
        "symbol": sym,
        "price": float(latest["close"]),
        "rsi": float(latest["RSI14"]),
        "ema12": float(latest["EMA12"]),
        "ema26": float(latest["EMA26"]),
        "bb_upper": float(latest["BB_UPPER"]),
        "bb_lower": float(latest["BB_LOWER"]),
        "prediction": pred,
        "technical": tech,
    }

    _CONTEXT_CACHE[key] = (now, ctx)
    return ctx
