
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import psycopg2
import pandas as pd
import numpy as np
# ✅ Import centralized DB configuration
from core.database import DB_CONFIG

# Initialize API router
router = APIRouter()

# --- Database config ---
# PostgreSQL connection settings
# DB_CONFIG = {
#     "dbname": "stock_data",
#     "user": "postgres",
#     "password": "root",
#     "host": "localhost",
#     "port": "5433",
# }

# --- Response model ---
class TrendResponse(BaseModel):
    """
    API response schema for trend analysis.
    """
    short_term: str
    mid_term: str
    long_term: str
    confidence: float

# --- Helper functions ---
def calculate_moving_averages(df: pd.DataFrame):
    """
    Calculates short, mid, and long-term moving averages
    based on closing price.
    """
    # 5-day moving average (short-term)
    df["MA5"] = df["close"].rolling(window=5, min_periods=1).mean()

    # 20-day moving average (mid-term)
    df["MA20"] = df["close"].rolling(window=20, min_periods=1).mean()

    # 50-day moving average (long-term)
    df["MA50"] = df["close"].rolling(window=50, min_periods=1).mean()
    return df

def determine_trend(current, ma):
    """
    Determines trend direction by comparing
    current price to moving average.
    """
    # Price is significantly above MA
    if current > ma * 1.01:
        return "Uptrend"
    # Price is significantly below MA
    elif current < ma * 0.99:
        return "Downtrend"
    # Price is near MA
    else:
        return "Sideways"

def compute_trends(df: pd.DataFrame):
    """
    Computes short, mid, and long-term trends
    along with a confidence score.
    """

    # Convert Decimal values from DB to float
    for col in ["open", "high", "low", "close", "close_norm"]:
        df[col] = df[col].astype(float)

    # Add moving average columns
    df = calculate_moving_averages(df)

    # Get the most recent closing price
    current_close = df["close"].iloc[-1]

    # Short-term trend based on 5-day MA
    short = determine_trend(current_close, df["MA5"].iloc[-1])

    # Mid-term trend based on 20-day MA
    mid = determine_trend(current_close, df["MA20"].iloc[-1]) 

    # Long-term trend based on 50-day MA
    long = determine_trend(current_close, df["MA50"].iloc[-1])

    # Confidence score based on distance from MA20
    conf = min(
        abs(current_close - df["MA20"].iloc[-1]) /
        df["MA20"].iloc[-1] * 100,
        100
    )

    return {
        "short_term": short,
        "mid_term": mid,
        "long_term": long,
        "confidence": round(conf, 2),
    }

# --- Endpoint ---
@router.get("/technical-status", response_model=TrendResponse)
def technical_status(symbol: str):
    """
    API endpoint that returns technical trend
    analysis for a given stock symbol.
    """
    try:
        # Establish database connection
        conn = psycopg2.connect(**DB_CONFIG)

        # SQL query to fetch historical stock data
        query = """
            SELECT date, close, open, high, low, close_norm
            FROM stocks
            WHERE symbol = %s
            ORDER BY date ASC
        """

        # Load query results into a DataFrame
        df = pd.read_sql(query, conn, params=(symbol,))
        conn.close()
    except Exception as e:
        # Handle database-related errors
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    # Handle missing or empty data
    if df.empty:
        raise HTTPException(
            status_code=404,
            detail="Symbol not found or no data available"
        )

    # Compute trend indicators
    trends = compute_trends(df)

    # Return trend analysis response
    return trends
