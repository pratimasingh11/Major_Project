from fastapi import APIRouter  
from utils.news_service import fetch_all_news  # Import a function that fetches news from a utility module

# Create a new router for news-related endpoints
# prefix="/api/news" means all routes here will start with /api/news
# tags=["News"] helps categorize this route in API documentation 
router = APIRouter(prefix="/api/news", tags=["News"])

# Define a GET endpoint to get all news
# The empty string "" means this will respond to /api/news
@router.get("")
async def get_all_news():  
    return fetch_all_news()  
