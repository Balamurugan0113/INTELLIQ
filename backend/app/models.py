from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from datetime import datetime


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    date = Column(String(32), nullable=False)
    type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    link = Column(String(500), nullable=True)


class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    role = Column(String(100), nullable=False)
    avatar = Column(String(500), nullable=True)
    linkedin = Column(String(500), nullable=True)
    github = Column(String(500), nullable=True)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)


class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Contact {self.id} {self.email}>"

