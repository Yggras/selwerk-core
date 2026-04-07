from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
from enum import Enum

class AuditStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"

class AuditRequest(BaseModel):
    url: str
    business_name: Optional[str] = None

class RedFlag(BaseModel):
    type: str # e.g., "NAP_MISMATCH", "MISSING_MAPS", "WRONG_PHONE"
    title: str
    description: str
    severity: str # "high" | "medium" | "low"
    platform: Optional[str] = None # "Google", "Facebook", etc.

class AuditSummary(BaseModel):
    report_id: str
    status: AuditStatus
    progress: int # 0-100
    overall_score: Optional[int] = None
    red_flags_count: int
    public_flags: List[RedFlag] # The "Teaser" content
    detected_data: Optional[Dict[str, Any]] = None

class AuditDetails(AuditSummary):
    private_flags: List[RedFlag] # The full list (gated)
    detected_data: Dict[str, Any]
