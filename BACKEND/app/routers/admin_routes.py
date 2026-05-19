from fastapi import *
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Complaint

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.put("/complaints/{id}")
def update_status(
    id: int,
    status: str,
    db: Session = Depends(get_db)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == id
    ).first()

    complaint.status = status

    db.commit()

    return {"message": "Updated"}