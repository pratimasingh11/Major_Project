# Import pandas library for reading and handling CSV data
import pandas as pd

# Import psycopg2 to connect Python with PostgreSQL
import psycopg2

# Import execute_values for fast bulk insert into PostgreSQL
from psycopg2.extras import execute_values

# ✅ Import centralized DB configuration
from core.database import DB_CONFIG


# Path to the cleaned CSV file (relative path)
csv_file = '../../data/clean/merged_stock_nepse.csv'


# -------------------------------
# Load CSV into a pandas DataFrame
# -------------------------------
# parse_dates converts the 'date' column into pandas datetime format
df = pd.read_csv(csv_file, parse_dates=['date'])

# PostgreSQL prefers Python date objects instead of pandas Timestamp
df['date'] = df['date'].dt.date

# List of columns that should contain numeric values
numeric_cols = ['open', 'high', 'low', 'close', 'close_norm']

# Convert each value to native Python float
# If value is missing (NaN), convert it to None
for col in numeric_cols:
    df[col] = df[col].apply(lambda x: float(x) if pd.notnull(x) else None)


# --------------------------------------------------
# Convert DataFrame rows into list of tuples
# --------------------------------------------------
values = [tuple(row) for row in df.itertuples(index=False, name=None)]


# -------------------------------
# Connect to PostgreSQL database
# -------------------------------
# conn = psycopg2.connect(
#     dbname='stock_data',   # Database name
#     user='postgres',       # Database username
#     password='root',       # Database password
#     host='localhost',      # Database host
#     port='5433'            # Database port
# )

# Create a cursor to execute SQL commands
conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

# --------------------------------------------------
# Insert data into the database efficiently
# --------------------------------------------------
execute_values(
    cur,
    """
    INSERT INTO stocks (date, symbol, open, high, low, close, close_norm)
    VALUES %s
    """,
    values
)


# Save (commit) all changes to the database
conn.commit()

# Close the cursor
cur.close()

# Close the database connection
conn.close()


# Success message
print("CSV imported successfully!")
