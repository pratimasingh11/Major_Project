# Import BaseModel from Pydantic to define request and response schemas
# EmailStr is a type that validates email strings
from pydantic import BaseModel, EmailStr

# -----------------------------
# Schema for creating a new user
# -----------------------------
class UserCreate(BaseModel):
    full_name: str  # User's full name
    email: EmailStr  # User's email (validated as a proper email)
    password: str  # User's password (should be hashed before storing in DB)

# -----------------------------
# Schema for returning user data to client
# -----------------------------
class UserResponse(BaseModel):
    id: int  # User's ID in the database
    full_name: str  # User's full name
    email: str  # User's email

    class Config:
        """
        Tells Pydantic to read data even if it's an ORM (like SQLAlchemy model)
        instead of a pure dict. This allows automatic conversion of DB models to response.
        """
        orm_mode = True

# -----------------------------
# Schema for logging in a user
# -----------------------------
class UserLogin(BaseModel):
    email: str  # Email used to log in
    password: str  # Password used to log in
