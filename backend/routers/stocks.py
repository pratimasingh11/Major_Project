from fastapi import APIRouter, Query # Import Query to handle query parameters in the URL
from core.database import get_db_connection

# Create an API router with a common prefix "/api"
# The tag "Stocks" helps group these APIs in Swagger UI
router = APIRouter(prefix="/api", tags=["Stocks"])


# -----------------------------
# Search suggestions endpoint
# -----------------------------
@router.get("/search-suggestions")
def search_stocks(q: str = Query(...)):
    """
    This endpoint provides stock search suggestions.
    It searches by symbol, company name, or category.
    
    Example:
    /api/search-suggestions?q=apple
    """
    conn = get_db_connection()
    cur = conn.cursor()

    # SQL query to search stocks by symbol, company name, or category
    # LOWER() is used to make the search case-insensitive
    query = """
    SELECT symbol, company_name, category
    FROM stock_info
    WHERE LOWER(symbol) LIKE LOWER(%s)
       OR LOWER(company_name) LIKE LOWER(%s)
       OR LOWER(category) LIKE LOWER(%s)
    LIMIT 10
    """

    # Add % wildcards for partial search
    # Example: "app" becomes "%app%"
    like_q = f"%{q}%"

    # Execute the query safely using parameterized SQL
    # This prevents SQL injection attacks
    cur.execute(query, (like_q, like_q, like_q))
    results = cur.fetchall()
    cur.close()
    conn.close()
    # convert raw db rows into json-friendly format
    return [
        {"symbol": r[0], "company_name": r[1], "category": r[2]}
        for r in results
    ]
# ------------------------------------
# Get companies by category endpoint
# ------------------------------------
@router.get("/companies-by-category")
def companies_by_category(category: str):
    """
    This endpoint returns all companies that belong to a given category.
    
    Example:
    /api/companies-by-category?category=Technology
    """
    conn = get_db_connection()
    cur = conn.cursor()

    # Execute query to fetch companies for a specific category
    cur.execute(
        "SELECT symbol, company_name, category FROM stock_info WHERE category=%s",
        (category,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Return results as a list of dictionaries
    return [{"symbol": r[0], "company_name": r[1], "category": r[2]} for r in rows]


# -------------------------
# Get all stocks endpoint
# -------------------------
@router.get("/all-stocks")
def get_all_stocks():
    """
    This endpoint returns all stocks from the database.
    
    Example:
    /api/all-stocks
    """
    conn = get_db_connection()
    cur = conn.cursor()

    # Execute query to get all stocks ordered alphabetically by symbol
    cur.execute("SELECT symbol, company_name, category FROM stock_info ORDER BY symbol ASC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Convert rows into a clean JSON-friendly format
    return [
        {"symbol": r[0], "company_name": r[1], "category": r[2]}
        for r in rows
    ]
