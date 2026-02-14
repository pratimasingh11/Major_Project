import pandas as pd

# -----------------------------
# Step 1: Load OHLC CSV
# -----------------------------
ohlc = pd.read_csv('../data/raw/OHLC.csv')

# Standardize column names
ohlc.columns = ohlc.columns.str.lower()
ohlc = ohlc[['date', 'symbol', 'open', 'high', 'low', 'close']]

# Clean numeric data
ohlc.replace('###', pd.NA, inplace=True)
ohlc[['open','high','low','close']] = ohlc[['open','high','low','close']].apply(pd.to_numeric, errors='coerce')

# Convert date column
ohlc['date'] = pd.to_datetime(ohlc['date'], errors='coerce')
ohlc.dropna(subset=['date','close'], inplace=True)

print("Cleaned Stock OHLC Data:")
print(ohlc.head())

# -----------------------------
# Step 2: Load NEPSE Excel
# -----------------------------
# Skip first row (title) and use second row as header
nepse = pd.read_excel('../data/raw/nepseinfo.xlsx', header=1)

# Standardize column names
nepse.columns = nepse.columns.str.lower().str.replace(' ', '_')

# Keep only relevant columns
nepse = nepse[['symbol', 'date', 'open', 'high', 'low', 'close']]

# Clean numeric data
nepse.replace('###', pd.NA, inplace=True)
nepse[['open','high','low','close']] = nepse[['open','high','low','close']].apply(pd.to_numeric, errors='coerce')

# Convert date column
nepse['date'] = pd.to_datetime(nepse['date'], errors='coerce')
nepse.dropna(subset=['date','close'], inplace=True)

# Add NEPSE as a symbol (already symbol column, but normalize casing)
nepse['symbol'] = nepse['symbol'].str.upper()

print("\nCleaned NEPSE Data:")
print(nepse.head())

# -----------------------------
# Step 3: Combine OHLC + NEPSE
# -----------------------------
combined = pd.concat([ohlc, nepse], ignore_index=True)

# -----------------------------
# Step 4: Normalize closing prices per symbol
# -----------------------------
# Use transform to keep same index
combined['close_norm'] = combined.groupby('symbol')['close'].transform(lambda x: x / x.iloc[0])

# Sort by symbol and date
combined.sort_values(by=['symbol','date'], inplace=True)

# -----------------------------
# Step 5: Save Cleaned Data
# -----------------------------
combined.to_csv('../data/clean/merged_stock_nepse.csv', index=False)
print("\nCombined Stock + NEPSE data saved to 'data/clean/merged_stock_nepse.csv'")
