from fastapi import APIRouter, HTTPException  # FastAPI tools: APIRouter to create routes, HTTPException to raise API errors
from pydantic import BaseModel  # BaseModel to define input/output data structure (schemas)
from sqlalchemy import create_engine, text  # SQLAlchemy tools to connect to DB and run SQL queries
import pandas as pd 
# ✅ Import the shared engine (NOT DB_CONFIG)
from core.database import engine

router = APIRouter()  # Create a new router for market-movers endpoints

# --- Database config ---
# Store database connection info
# DB_CONFIG = {
#     "dbname": "stock_data",
#     "user": "postgres",
#     "password": "root",
#     "host": "localhost",
#     "port": "5433",
# }

# --- Response models ---
class StockData(BaseModel):
    """
    Schema for each stock's data
    """
    symbol: str  # Stock symbol (e.g., AAPL)
    company_name: str  # Name of the company
    current_price: float  # Current stock price
    change_percent: float  # Price change in percentage
    last_7_days: list[float]  # List of last 7 days of closing prices

class MarketMoversResponse(BaseModel):
    """
    Schema for the API response of market movers
    """
    gainers: list[StockData]  # Top gainers
    losers: list[StockData]  # Top losers

# --- Create SQLAlchemy engine ---
# # Build DB URL and create engine to connect
# DB_URL = f"postgresql+psycopg2://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
# engine = create_engine(DB_URL, echo=False, future=True)  # echo=False disables SQL logging, future=True uses latest SQLAlchemy API

# --- Endpoint ---
@router.get("/market-movers", response_model=MarketMoversResponse)
def market_movers():
    """
    Get top 10 gainers and losers in the stock market
    """
    try:
        with engine.connect() as conn:  # Open a connection to the database
            query = text("""
                WITH ranked AS (
                    SELECT
                        s.symbol,
                        COALESCE(si.company_name, s.symbol) AS company_name,
                        s.close,
                        LAG(s.close) OVER (PARTITION BY s.symbol ORDER BY s.date) AS prev_close,
                        ROW_NUMBER() OVER (PARTITION BY s.symbol ORDER BY s.date DESC) AS rn
                    FROM stocks s
                    LEFT JOIN stock_info si ON s.symbol = si.symbol
                    WHERE s.close IS NOT NULL
                ),
                latest AS (
                    SELECT *
                    FROM ranked
                    WHERE rn = 1
                ),
                last_days AS (
                    SELECT
                        s.symbol,
                        ARRAY_AGG(s.close ORDER BY s.date DESC) AS all_closes
                    FROM stocks s
                    GROUP BY s.symbol
                )
                SELECT
                    l.symbol,
                    l.company_name,
                    l.close AS current_price,
                    ROUND(
                        ((l.close - l.prev_close) / NULLIF(l.prev_close, 0)) * 100
                    , 2) AS change_percent,
                    ld.all_closes
                FROM latest l
                LEFT JOIN last_days ld ON l.symbol = ld.symbol
                ORDER BY change_percent DESC;
            """)  # SQL query to calculate latest stock prices, change %, and last 7 days of closes

            df = pd.read_sql(query, conn)  # Read SQL query results into a pandas DataFrame

            if df.empty:
                # Raise 404 error if no data found
                raise HTTPException(status_code=404, detail="No stock data available")

            # Only keep last 7 days of closing prices in Python
            df["last_7_days"] = df["all_closes"].apply(lambda x: x[:7] if x else [])

            # Top 10 gainers
            gainers_df = df[df["change_percent"] > 0].nlargest(10, "change_percent")  # Sort descending
            gainers = gainers_df.to_dict(orient="records")  # Convert DataFrame to list of dicts

            # Top 10 losers
            losers_df = df[df["change_percent"] < 0].nsmallest(10, "change_percent")  # Sort ascending
            losers = losers_df.to_dict(orient="records")  # Convert DataFrame to list of dicts

            # Clean up dicts to match Pydantic model
            for g in gainers:
                g["last_7_days"] = g.pop("last_7_days")  # Ensure key matches model
            for l in losers:
                l["last_7_days"] = l.pop("last_7_days")  # Ensure key matches model

            # Return final response
            return {
                "gainers": gainers,
                "losers": losers
            }

    except Exception as e:
        # Catch all exceptions and return 500 Internal Server Error
        raise HTTPException(status_code=500, detail=f"SQL ERROR: {e}")
