"""
Each class represents a table in the database.
Columns in the class represent fields in the table.
"""
# Import required SQLAlchemy classes for defining database columns and types
from sqlalchemy import Column, Integer, String, DateTime, func

# Import the Base class from your core database setup
# Base is the declarative base class that all models inherit from
from core.database import Base

# Define a User model that represents the "users" table in the database
class User(Base):
    """
    User model represents a registered user in the system.
    """
    # Specify the name of the database table
    __tablename__ = "users"
    # Primary key column for the user (auto-incremented integer)
    id = Column(Integer, primary_key=True, index=True)

    # Full name of the user, max 150 characters, cannot be null
    full_name = Column(String(150), nullable=False)

    # Email of the user, max 255 characters, must be unique, indexed, cannot be null
    email = Column(String(255), unique=True, index=True, nullable=False)

    # Password column, stores the hashed password, cannot be null
    password = Column(String, nullable=False)

    # Timestamp when the user was created, automatically set to current time
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Timestamp when the user was last updated, automatically updates on row update
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
