from pathlib import Path
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# ✅ IMPORT DATABASE CONFIG FROM CORE
from core.database import DB_CONFIG


def run_stock_info_pipeline(
    merged_stock_path=None,
    company_list_path=None,
    output_path=None
):
    """
    Stock info pipeline:
    1. Load merged stock and company list CSVs
    2. Clean and merge data
    3. Save a clean CSV
    4. Insert or update data into PostgreSQL
    """

    base_path = Path(__file__).parent

    # -------------------------------
    # Default file paths
    # -------------------------------
    if merged_stock_path is None:
        merged_stock_path = base_path / "../../data/clean/merged_stock_nepse.csv"
    if company_list_path is None:
        company_list_path = base_path / "../../data/raw/CompanyList.csv"
    if output_path is None:
        output_path = base_path / "../../data/clean/clean_stock_info.csv"

    # -------------------------------
    # Load CSVs
    # -------------------------------
    merged_df = pd.read_csv(merged_stock_path)
    company_df = pd.read_csv(company_list_path)

    # -------------------------------
    # Prepare company info
    # -------------------------------
    company_df = company_df[['Symbol', 'Company Name', 'Sector']].copy()
    company_df.columns = ['symbol', 'company_name', 'category']

    # -------------------------------
    # Standardize symbols
    # -------------------------------
    merged_df['symbol'] = merged_df['symbol'].astype(str).str.strip().str.upper()
    company_df['symbol'] = company_df['symbol'].astype(str).str.strip().str.upper()

    # -------------------------------
    # Merge stock and company info
    # -------------------------------
    merged_info = pd.merge(
        merged_df[['symbol']].drop_duplicates(),
        company_df,
        on='symbol',
        how='left'
    )

    # -------------------------------
    # Handle missing values
    # -------------------------------
    merged_info['company_name'] = merged_info['company_name'].fillna('Unknown Company')
    merged_info['category'] = merged_info['category'].fillna('Others')
    merged_info = merged_info.drop_duplicates(subset=['symbol'])

    # -------------------------------
    # Save cleaned CSV
    # -------------------------------
    merged_info.to_csv(output_path, index=False)
    print(f"Cleaned stock info saved to: {output_path}")

    # -------------------------------
    # Insert / Update PostgreSQL
    # -------------------------------
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    values = [tuple(row) for row in merged_info.to_numpy()]
    batch_size = 100

    for i in range(0, len(values), batch_size):
        execute_values(
            cur,
            """
            INSERT INTO stock_info (symbol, company_name, category)
            VALUES %s
            ON CONFLICT (symbol)
            DO UPDATE SET
                company_name = EXCLUDED.company_name,
                category = EXCLUDED.category
            """,
            values[i:i + batch_size]
        )

    conn.commit()
    cur.close()
    conn.close()

    print(f"{len(values)} rows inserted/updated in stock_info table.")
    return merged_info


# -------------------------------
# Run pipeline directly
# -------------------------------
if __name__ == "__main__":
    run_stock_info_pipeline()
