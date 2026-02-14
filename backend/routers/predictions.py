# routers/predictions.py  (or wherever your predict router is)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import time
import numpy as np
import pandas as pd
import tensorflow as tf
from sqlalchemy import create_engine

from utils.preprocessing import scale_data
from ML.train_lstm import DB_CONFIG

router = APIRouter()

# -----------------------------
# Performance caches
# -----------------------------
MODEL_CACHE = {}        # symbol -> loaded tf model
ENGINE_CACHE = None     # single SQLAlchemy engine
PRED_CACHE = {}         # symbol -> (timestamp, result)

PRED_TTL_SECONDS = 60   # cache prediction for 60s (tune to 300 if you want)
DEBUG = False           # set True only when debugging


class TechnicalPredictionResponse(BaseModel):
    symbol: str
    very_short_term: str
    short_term: str
    mid_term: str
    long_term: str
    confidence: float


def determine_trend(current, predicted, threshold=0.01):
    change = (predicted - current) / current
    if change > threshold:
        return "Uptrend", min(change * 100, 100)
    elif change < -threshold:
        return "Downtrend", min(abs(change) * 100, 100)
    else:
        return "Sideways", min(abs(change) * 100, 100)


def iterative_prediction(model, last_window, days):
    window = last_window.copy()
    for _ in range(days):
        x_input = window[-60:].reshape(1, 60, 1)
        pred_scaled = model.predict(x_input, verbose=0)
        window = np.append(window, pred_scaled[-1])
    return window[-1]


def get_engine():
    global ENGINE_CACHE
    if ENGINE_CACHE is None:
        db_url = (
            f"postgresql+psycopg2://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
            f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
        )
        ENGINE_CACHE = create_engine(db_url, pool_pre_ping=True)
    return ENGINE_CACHE


def get_model(symbol: str, model_path: str):
    sym = symbol.upper()
    if sym in MODEL_CACHE:
        return MODEL_CACHE[sym]
    model = tf.keras.models.load_model(model_path, compile=False)
    MODEL_CACHE[sym] = model
    return model


@router.get("/predict", response_model=TechnicalPredictionResponse)
def predict(symbol: str):
    sym = symbol.upper().strip()
    now = time.time()

    # 1) prediction cache (fast return)
    if sym in PRED_CACHE:
        ts, cached = PRED_CACHE[sym]
        if now - ts < PRED_TTL_SECONDS:
            return cached

    # 2) model exists?
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_dir = os.path.join(base_dir, "ML", "models")
    model_path = os.path.join(model_dir, f"{sym}_model.h5")

    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model not found. Train LSTM first.")

    # 3) load model (cached)
    try:
        model = get_model(sym, model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {e}")

    # 4) fetch only close column (fast)
    try:
        engine = get_engine()
        query = "SELECT close FROM stocks WHERE symbol=%s ORDER BY date ASC"
        df = pd.read_sql(query, engine, params=(sym,))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    if df.empty:
        raise HTTPException(status_code=404, detail="Symbol not found or no data available")

    data = df["close"].values.reshape(-1, 1)
    scaled, scaler = scale_data(data)
    last_window = scaled[-60:].reshape(-1, 1)
    current_close = float(df["close"].iloc[-1])

    horizons = {
        "very_short_term": 3,
        "short_term": 7,
        "mid_term": 20,
        "long_term": 60,
    }

    trends = {}
    confidences = []

    for key, days in horizons.items():
        predicted_scaled = iterative_prediction(model, last_window, days)
        predicted_price = float(scaler.inverse_transform(np.array([[predicted_scaled]]))[0][0])
        trend, conf = determine_trend(current_close, predicted_price)
        trends[key] = trend
        confidences.append(conf)

    overall_confidence = float(max(confidences))
    result = {
        "symbol": sym,
        **trends,
        "confidence": round(overall_confidence, 2),
    }

    if DEBUG:
        print(f"{sym} prediction cached: {result}")

    # 5) store in cache
    PRED_CACHE[sym] = (now, result)
    return result
