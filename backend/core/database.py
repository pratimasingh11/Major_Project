#===================================================
# 1. Package Imports
#===================================================
# psycopg2 is used for executing raw SQL queries
import psycopg2
import os

# SQLAlchemy imports for ORM-based database interaction
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
 

#===================================================
# 2. Database Configuration


DB_CONFIG = {
    "dbname": os.getenv("DATABASE_NAME", "stock_data"),
    "user": os.getenv("DATABASE_USER", "postgres"),
    "password": os.getenv("DATABASE_PASSWORD", "root"),
    "host": os.getenv("DATABASE_HOST", "localhost"),
    "port": os.getenv("DATABASE_PORT", "5433"),
}


#===================================================
# 3. psycopg2 Connection (Raw SQL)
#===================================================
# This function creates and returns a direct database
# connection using psycopg2.

def get_db_connection():
    return psycopg2.connect(
        **DB_CONFIG,
        connect_timeout=5
    )


#===================================================
# 4. SQLAlchemy Setup (ORM)
#===================================================
# SQLAlchemy connection URL built from DB_CONFIG

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
    f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
)


#===================================================
# 4-1. Engine Creation
#===================================================
# The engine is the core interface to the database
# It manages connections and executes SQL internally
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)



#===================================================
# 4-2. Session Factory
#===================================================
# SessionLocal is used to create database sessions

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

#===================================================
# 4-3. Base Class for ORM Models
#===================================================
# Base is inherited by all ORM models

Base = declarative_base()
