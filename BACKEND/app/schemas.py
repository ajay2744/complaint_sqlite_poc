from pydantic import BaseModel


# REGISTER
class UserRegisterSchema(BaseModel):

    username: str

    password: str

    phone: str

    city: str

    boutique_name: str

    boutique_code: str

    role: str


# LOGIN
class UserLoginSchema(BaseModel):

    username: str

    password: str

    role: str