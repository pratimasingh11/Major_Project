"""
analysis.py

This router handles stock market analysis APIs.
It fetches stock data from the database, resamples it
based on timeframe, and calculates technical indicators
like RSI, EMA, and Bollinger Bands.
"""

# Import FastAPI router to define API routes
from fastapi import APIRouter

# Import database connection helper
from core.database import get_db_connection

import pandas as pd

import numpy as np

# Create an API router with a URL prefix and tag
router = APIRouter(prefix="/api", tags=["Analysis"])


# -------------------------------------------------------------------
# Helper Functions
# -------------------------------------------------------------------

"""
This function cleans the DataFrame so it can be safely
converted to JSON.

- Replaces infinity values with None
- Replaces NaN values with None
"""
def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], None)
    df = df.where(pd.notnull(df), None)
    return df


"""
This function calculates the Relative Strength Index (RSI).

RSI helps identify overbought or oversold conditions.
- Values above 70 → overbought
- Values below 30 → oversold
"""
def calculate_rsi(series: pd.Series, period=14):
    delta = series.diff() # difference between today and yesterday
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    #calculate avg gain and avg loss over 14 days
    avg_gain = gain.rolling(window=period, min_periods=1).mean()
    avg_loss = loss.rolling(window=period, min_periods=1).mean()
    #rsi formula
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(0)


"""
This function calculates Bollinger Bands.

- Upper Band = Moving Average + (Standard Deviation × multiplier)
- Lower Band = Moving Average - (Standard Deviation × multiplier)

Used to measure price volatility.
"""
def calculate_bollinger(series: pd.Series, window=20, num_std=2):
    ma = series.rolling(window).mean()
    std = series.rolling(window).std()
    upper = ma + (std * num_std)
    lower = ma - (std * num_std)
    return upper.fillna(0), lower.fillna(0), ma.fillna(0)


"""
This function resamples stock data based on the selected timeframe.

Supported timeframes:
1D, 1W, 1M, 6M, 1Y, 3Y, 5Y

It also calculates:
- Average price
- Price change %
- Moving averages
- EMA
- RSI
- Bollinger Bands
"""
def resample_data(df: pd.DataFrame, timeframe: str) -> pd.DataFrame:
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    df.set_index("date", inplace=True)

    days_map = {
        "1D": 1,
        "6M": 180,
        "1Y": 365,
        "3Y": 1095,
        "5Y": 1825
    }

    if timeframe == "1W":
        df_resampled = df.resample("W").agg({
            "open": "first",
            "high": "max",
            "low": "min",
            "close": "last",
            "close_norm": "last"
        })
        df_resampled = df_resampled.tail(52)  # last 1 year of weeks
    elif timeframe == "1M":
        df_resampled = df.resample("D").agg({
            "open": "first",
            "high": "max",
            "low": "min",
            "close": "last",
            "close_norm": "last"
        })
        df_resampled = df_resampled.tail(30)  # last 30 days only
    elif timeframe in days_map:
        df_resampled = df.tail(days_map[timeframe])
    else:
        df_resampled = df.copy()  # ALL data

    # -------------------------
    # Technical Indicators
    # -------------------------
    df_resampled["avg_price"] = (df_resampled["high"] + df_resampled["low"]) / 2
    df_resampled["price_change"] = df_resampled["close"].pct_change(fill_method=None) * 100
    df_resampled["price_change"] = df_resampled["price_change"].replace([np.inf, -np.inf, np.nan], 0)
    df_resampled["rolling_mean_20"] = df_resampled["close"].rolling(window=20, min_periods=1).mean()
    df_resampled["EMA12"] = df_resampled["close"].ewm(span=12).mean()
    df_resampled["EMA26"] = df_resampled["close"].ewm(span=26).mean()
    df_resampled["RSI14"] = calculate_rsi(df_resampled["close"])
    df_resampled["BB_UPPER"], df_resampled["BB_LOWER"], df_resampled["BB_MA20"] = calculate_bollinger(df_resampled["close"])

    df_resampled.reset_index(inplace=True)
    return clean_dataframe(df_resampled)




# -------------------------------------------------------------------
# API Endpoint
# -------------------------------------------------------------------

"""
GET /api/stocks

Query Parameters:
- symbol: Stock symbol (default: NEPSE)
- timeframe: Time range for data (default: 1Y)

Returns:
- List of stock records with technical indicators
"""
@router.get("/stocks")
def get_stock(symbol: str = "NEPSE", timeframe: str = "1Y"):
    conn = get_db_connection()

    # SQL query to fetch stock data
    query = """
        SELECT date, symbol, open, high, low, close, close_norm
        FROM stocks
        WHERE LOWER(symbol) = LOWER(%s)
        ORDER BY date ASC
    """

    # Load SQL result into a Pandas DataFrame
    df = pd.read_sql(query, conn, params=(symbol,))
    conn.close()

    # Handle case when no data is found
    if df.empty:
        return {"message": f"No data found for symbol {symbol}", "records": []}

    # Apply resampling and indicator calculations
    df_filtered = resample_data(df, timeframe)

    # Convert DataFrame to JSON-friendly format
    return {"records": df_filtered.to_dict(orient="records")}
