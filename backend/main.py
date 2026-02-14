from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis, stocks, auth, technical_status
from routers.predictions import router as lstm_predict  # Router for LSTM predictions
from routers.market_movers import router as market_movers_router  # Router for market movers
from routers.news import router as news_router  # Router for news endpoints
from routers.chat.router import router as chat_router

# Create FastAPI app instance
app = FastAPI()

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any website
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include router (handles  endpoints)
app.include_router(analysis.router)
app.include_router(stocks.router)
app.include_router(auth.router)
app.include_router(technical_status.router, prefix="/api")
# Include LSTM prediction router with '/api' prefix (for stock predictions)
app.include_router(lstm_predict, prefix="/api")
# Include market movers router with '/api' prefix (top gainers/losers)
app.include_router(market_movers_router, prefix="/api")
# Include news router (fetches news, no API prefix)
app.include_router(news_router)  # no redirect_slashes parameter
app.include_router(chat_router) #for the chatbot 
