from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from app.database import SessionLocal
from app.models import User
from app.schemas import (
    UserRegisterSchema,
    UserLoginSchema
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# REGISTER
@router.post("/register")
def register(
    user: UserRegisterSchema,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Allow only user/admin roles
    if user.role not in ["user", "admin"]:

        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    if len(user.password) > 72:

        raise HTTPException(
            status_code=400,
            detail="Password too long"
        )

    db_user = User(

        username=user.username,

        password=bcrypt.hash(
            user.password[:72]
        ),

        role=user.role,

        phone=user.phone,

        city=user.city,

        boutique_name=user.boutique_name,

        boutique_code=user.boutique_code
    )

    db.add(db_user)

    db.commit()

    db.refresh(db_user)

    return {

        "message": "Registered successfully",

        "user_id": db_user.user_id,

        "username": db_user.username,

        "role": db_user.role
    }


# LOGIN
@router.post("/login")
def login(
    user: UserLoginSchema,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    # Verify password
    if not bcrypt.verify(
        user.password[:72],
        db_user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    # Verify role
    if user.role != db_user.role:

        raise HTTPException(
            status_code=401,
            detail="Invalid role"
        )

    return {

        "message": "Login successful",

        "user_id": db_user.user_id,

        "username": db_user.username,

        "role": db_user.role
    }