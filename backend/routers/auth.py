from fastapi import APIRouter, Depends, HTTPException  # FastAPI tools: APIRouter to group routes, Depends for dependencies, HTTPException to raise errors
from sqlalchemy.orm import Session  # SQLAlchemy session to interact with the database
from core.database import SessionLocal  # Function to create a new database session
from models import User  # Import User model which represents users in the database
from schemas import UserCreate, UserResponse, UserLogin  # Schemas for input/output validation for signup/login
from passlib.context import CryptContext  # Tool for hashing and verifying passwords securely
from passlib.exc import UnknownHashError  # Exception to catch invalid or unknown password hashes

router = APIRouter(prefix="/auth", tags=["Auth"])  # Create a group of routes for authentication

# ------------------------
# Password hashing setup
# ------------------------
# Use Argon2 to safely store passwords
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")  # This will hash and verify passwords

# ------------------------
# Database dependency
# ------------------------
def get_db():
    """Get a database session for use in routes"""
    db = SessionLocal()  # Create a new database session
    try:
        yield db  # Give the session to the route
    finally:
        db.close()  # Close the session when done

# ------------------------
# Hash password safely
# ------------------------
def hash_password(password: str) -> str:
    """Turn a plain password into a secure hashed password"""
    return pwd_context.hash(password)  # Hash the password with Argon2

# ------------------------
# Verify password safely
# ------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if a plain password matches the hashed password.
    If the hash is broken or unknown, return False.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)  # Check password
    except UnknownHashError:
        # If the hash is invalid, don't crash, just say False
        return False

# ------------------------
# Signup endpoint
# ------------------------
@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account"""
    existing_user = db.query(User).filter(User.email == user.email).first()  # Check if email exists
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")  # Stop if email taken

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password)  # Hash password before saving
    )

    db.add(new_user)  # Add the new user to the database
    db.commit()  # Save changes
    db.refresh(new_user)  # Get updated user info from the database

    return new_user  # Return the created user

# ------------------------
# Login endpoint
# ------------------------
@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    Log in a user using email and password.
    Returns user info if correct, error if wrong.
    """
    db_user = db.query(User).filter(User.email == user.email).first()  # Find user by email

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")  # Stop if wrong password or email

    return db_user  # Return the logged-in user
