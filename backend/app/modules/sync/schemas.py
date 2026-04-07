from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class ProfileBase(BaseModel):
    business_name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    hours: Optional[Dict[str, str]] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: Optional[str] = None
    shadow_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SyncTriggerRequest(BaseModel):
    profile_id: str
    email: EmailStr # Email for account creation/linking

class SyncStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    platform_status: Dict[str, str]
    checkout_url: Optional[str] = None
