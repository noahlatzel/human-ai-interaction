from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# Discussion Schemas
class DiscussionBase(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200)
    content: str = Field(..., min_length=10)
    category: str = Field(..., pattern="^(general|math|study-tips|technical)$")


class DiscussionCreate(DiscussionBase):
    pass


class DiscussionAuthor(BaseModel):
    id: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    gender: str = "male"
    
    class Config:
        from_attributes = True


class DiscussionReplyBase(BaseModel):
    content: str = Field(..., min_length=1)


class DiscussionReplyCreate(DiscussionReplyBase):
    pass


class DiscussionReply(DiscussionReplyBase):
    id: int
    discussion_id: int
    author: DiscussionAuthor
    created_at: datetime
    
    class Config:
        from_attributes = True


class Discussion(DiscussionBase):
    id: int
    author: DiscussionAuthor
    created_at: datetime
    updated_at: Optional[datetime]
    reply_count: int = 0
    is_subscribed: bool = False
    
    class Config:
        from_attributes = True


class DiscussionDetail(Discussion):
    replies: List[DiscussionReply] = []
    
    class Config:
        from_attributes = True


# Notification Schemas
class NotificationBase(BaseModel):
    type: str
    message: str
    discussion_id: Optional[int] = None


class Notification(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationUpdate(BaseModel):
    is_read: bool
