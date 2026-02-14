import sys  # Provides access to system-specific parameters and functions
import os   # Provides functions to interact with the operating system

# Make backend folder discoverable so Python can import modules from parent directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Directory of this script
PARENT_DIR = os.path.dirname(BASE_DIR)                 # Parent directory of script
sys.path.append(PARENT_DIR)                             # Add parent directory to Python path

# Import libraries for database, data handling, and numerical operations
import psycopg2  
import pandas as pd  
import numpy as np  
# ✅ Import centralized DB configuration
from core.database import DB_CONFIG 

# Import functions from your own modules
from ML.lstm_model import create_lstm                 # Function to create LSTM model
from utils.preprocessing import scale_data, create_sequences  # Functions to preprocess data


# Database connection configuration
# DB_CONFIG = {
#     "dbname": "stock_data",  
#     "user": "postgres",      
#     "password": "root",      
#     "host": "localhost",     
#     "port": "5433",          
# }

# Set up directory to save trained models
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # Current script directory
MODEL_DIR = os.path.join(SCRIPT_DIR, "models")           # "models" folder inside current directory
os.makedirs(MODEL_DIR, exist_ok=True)                   # Create folder if it doesn't exist


# Function to train LSTM model for a single stock symbol
def train_for_symbol(symbol, df):
    df = df.sort_values("date")                  # Ensure data is sorted by date
    data = df["close"].values.reshape(-1, 1)     # Extract closing prices as a column vector
    scaled, scaler = scale_data(data)            # Scale data (normalize to 0-1 range)

    X, y = create_sequences(scaled)              # Create sequences for time-series learning
    X = np.array(X).reshape(X.shape[0], X.shape[1], 1)  # Reshape for LSTM input (samples, time steps, features)

    model = create_lstm((X.shape[1], 1))         # Create LSTM model with input shape
    model.fit(X, y, epochs=10, batch_size=32, verbose=1)  # Train the model

    model.save(f"{MODEL_DIR}/{symbol}_model.h5") # Save trained model to file
    print(f"✔ Model saved for {symbol}")         # Print success message


# Main function to train models for all symbols in database
def main():
    conn = psycopg2.connect(**DB_CONFIG) 
    cur = conn.cursor()                  

    cur.execute("SELECT DISTINCT symbol FROM stocks")  # Get all unique stock symbols
    symbols = [row[0] for row in cur.fetchall()]      # Fetch symbols as a list

    for symbol in symbols:                     
        print(f"Training model for: {symbol}")   # Print which symbol is being trained

        # Read historical closing price data for the current symbol
        df = pd.read_sql(
            "SELECT date, close FROM stocks WHERE symbol=%s ORDER BY date ASC",
            conn,
            params=(symbol,),                    # Parameterized query to avoid SQL injection
        )

        if len(df) < 100:                        # Skip symbols with too little data
            print(f"Skipping {symbol} (not enough data)")
            continue

        train_for_symbol(symbol, df)             # Train model for this symbol

    conn.close()  


# Run main() if this script is executed directly
if __name__ == "__main__":
    main()
