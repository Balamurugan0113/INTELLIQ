from pydantic import BaseModel, Field, EmailStr


class EventOut(BaseModel):
    id: int
    title: str
    date: str
    type: str
    description: str | None = None
    link: str | None = None
    class Config:
        from_attributes = True


class EventIn(BaseModel):
    title: str
    date: str
    type: str
    description: str | None = None
    link: str | None = None


class EventUpdate(BaseModel):
    title: str | None = None
    date: str | None = None
    type: str | None = None
    description: str | None = None
    link: str | None = None


class MemberOut(BaseModel):
    id: int
    name: str
    role: str
    avatar: str | None = None
    linkedin: str | None = None
    github: str | None = None
    class Config:
        from_attributes = True


class MemberIn(BaseModel):
    name: str
    role: str
    avatar: str | None = None
    linkedin: str | None = None
    github: str | None = None


class MemberUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    avatar: str | None = None
    linkedin: str | None = None
    github: str | None = None


class MessageIn(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    message: str = Field(min_length=1)


class MessageOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    created_at: str
    class Config:
        from_attributes = True

