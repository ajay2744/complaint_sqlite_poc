from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Form,
    UploadFile,
    File
)

from sqlalchemy.orm import Session

import os
import shutil

from app.database import SessionLocal

from app.models import (
    Complaint,
    User
)

router = APIRouter()

UPLOAD_DIR = "app/uploads"


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE COMPLAINT
@router.post("/complaints")
async def create_complaint(

    machine_name: str = Form(...),

    complaint_description: str = Form(...),

    user_id: int = Form(...),

    file: UploadFile = File(None),

    db: Session = Depends(get_db)
):

    # Check user exists
    db_user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Create uploads folder
    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    file_path = None

    # Optional file upload
    if file is not None:

        # Store only filename in DB
        file_path = file.filename

        # Actual save path
        save_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(
            save_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

    # Create complaint
    complaint = Complaint(

        machine_name=machine_name,

        description=
            complaint_description,

        image_path=file_path,

        status="Open",

        user_id=user_id
    )

    db.add(complaint)

    db.commit()

    db.refresh(complaint)

    return {

        "message":
            "Complaint Created Successfully",

        "complaint_id":
            complaint.complaint_id,

        "user_id":
            complaint.user_id
    }


# GET ALL COMPLAINTS WITH USER DATA
@router.get("/complaints")
def get_complaints(
    db: Session = Depends(get_db)
):

    complaints = db.query(
        Complaint,
        User
    ).join(
        User,
        Complaint.user_id ==
        User.user_id
    ).all()

    result = []

    for complaint, user in complaints:

        result.append({

            "complaint_id":
                complaint.complaint_id,

            "machine_name":
                complaint.machine_name,

            "description":
                complaint.description,

            "status":
                complaint.status,

            "image_path":
                complaint.image_path,

            "complaint_time":
                complaint.complaint_time,

            "user_id":
                user.user_id,

            "username":
                user.username,

            "phone":
                user.phone,

            "city":
                user.city,

            "boutique_name":
                user.boutique_name,

            "boutique_code":
                user.boutique_code
        })

    return result

# GET COMPLAINTS FOR A USER
@router.get("/complaints/user/{user_id}")
def get_user_complaints(

    user_id: int,

    db: Session = Depends(get_db)
):

    complaints = db.query(
        Complaint,
        User
    ).join(
        User,
        Complaint.user_id == User.user_id
    ).filter(

        Complaint.user_id == user_id

    ).all()

    result = []

    for complaint, user in complaints:

        result.append({

            "complaint_id":
                complaint.complaint_id,

            "machine_name":
                complaint.machine_name,

            "description":
                complaint.description,

            "status":
                complaint.status,

            "image_path":
                complaint.image_path,

            "complaint_time":
                complaint.complaint_time,

            "username":
                user.username,

            "city":
                user.city,

            "boutique_name":
                user.boutique_name
        })

    return result


# UPDATE STATUS
@router.put(
    "/complaints/{complaint_id}"
)
def update_complaint_status(

    complaint_id: int,

    status: str,

    db: Session = Depends(get_db)
):

    complaint = db.query(
        Complaint
    ).filter(

        Complaint.complaint_id ==
        complaint_id

    ).first()

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint.status = status

    db.commit()

    db.refresh(complaint)

    return {

        "message":
            "Status Updated",

        "status":
            complaint.status
    }