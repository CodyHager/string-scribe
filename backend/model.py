from pydantic import BaseModel
from datetime import datetime


class UserID(BaseModel):
    id: str


class AppMetadata(BaseModel):
    last_invoice: datetime
