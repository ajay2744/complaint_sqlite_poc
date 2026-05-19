from sqlalchemy import *

from datetime import datetime
import pytz

from app.database import Base


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    username = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=True
    )

    city = Column(
        String(100),
        nullable=True
    )

    boutique_name = Column(
        String(255),
        nullable=True
    )

    boutique_code = Column(
        String(100),
        nullable=True
    )


class Complaint(Base):

    __tablename__ = "complaints"

    complaint_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    machine_name = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50),
        default="Open"
    )

    image_path = Column(
        String(255),
        nullable=True
    )

    india = pytz.timezone(
    "Asia/Kolkata"
    )

    complaint_time = Column(
        DateTime,
        default=datetime.now(india)
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )