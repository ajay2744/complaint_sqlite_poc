from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base

from app.routers import (
    auth_routes,
    complaint_routes,
    admin_routes
)

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.include_router(auth_routes.router)

app.include_router(complaint_routes.router)

app.include_router(admin_routes.router)


@app.get("/")
def home():
    return {
        "message": "Complaint Management Backend Running"
    }