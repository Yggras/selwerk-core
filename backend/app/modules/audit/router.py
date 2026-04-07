from fastapi import APIRouter, HTTPException, BackgroundTasks
from .schemas import AuditRequest, AuditSummary, AuditDetails, AuditStatus, RedFlag
from .engine import InsitesClient, RuleParser
from typing import Dict, List
import uuid

router = APIRouter(prefix="/audit", tags=["Audit"])
client = InsitesClient()

# Simple in-memory storage for MVP. In Production, this would be Redis/PostgreSQL.
audit_store: Dict[str, Dict] = {}

@router.post("/run", response_model=Dict[str, str])
async def run_audit(request: AuditRequest):
    report_id = await client.trigger_report(request.url, request.business_name)
    if not report_id:
        raise HTTPException(status_code=422, detail="Starting audit failed")
    
    # Initialize local state
    audit_store[report_id] = {
        "status": AuditStatus.RUNNING,
        "progress": 10,
        "url": request.url,
        "name": request.business_name
    }
    
    return {"reportId": report_id}

@router.get("/status/{report_id}", response_model=AuditSummary)
async def get_status(report_id: str):
    if report_id not in audit_store:
        # Check if it was a real Insites ID not in current memory (after restart)
        insites_data = await client.fetch_report(report_id)
        if not insites_data or insites_data.get("status") == "error":
            raise HTTPException(status_code=404, detail="Audit not found")
        
        # Hydrate local store
        is_complete = insites_data.get("report_status") == "complete"
        audit_store[report_id] = {
            "status": AuditStatus.COMPLETE if is_complete else AuditStatus.RUNNING,
            "progress": 100 if is_complete else 50,
            "data": insites_data.get("report", {})
        }

    job = audit_store[report_id]
    
    # If not complete, poll Insites again
    if job["status"] != AuditStatus.COMPLETE:
        insites_data = await client.fetch_report(report_id)
        if insites_data.get("report_status") == "complete":
            job["status"] = AuditStatus.COMPLETE
            job["progress"] = 100
            job["data"] = insites_data.get("report", {})
        else:
            job["progress"] = min(job["progress"] + 15, 95) # Simulierter Inkrement

    # Parse Flags
    all_flags = RuleParser.extract_red_flags(job.get("data", {}), pedant=True)
    
    # Public vs Private split (Server-side Gating)
    # Lead Gen: Only show first 2 flags publicly
    public_flags = all_flags[:2]

    return AuditSummary(
        report_id=report_id,
        status=job["status"],
        progress=job["progress"],
        overall_score=job.get("data", {}).get("overall_score"),
        red_flags_count=len(all_flags),
        public_flags=public_flags
    )

@router.get("/details/{report_id}", response_model=AuditDetails)
async def get_details(report_id: str, email: str):
    # This endpoint is "gated" by email being provided. 
    # In Modul 2, we would link this to a real User Session.
    if report_id not in audit_store:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    job = audit_store[report_id]
    if job["status"] != AuditStatus.COMPLETE:
        raise HTTPException(status_code=400, detail="Audit not complete yet")
    
    all_flags = RuleParser.extract_red_flags(job["data"], pedant=True)
    
    return AuditDetails(
        report_id=report_id,
        status=job["status"],
        progress=job["progress"],
        overall_score=job["data"].get("overall_score"),
        red_flags_count=len(all_flags),
        public_flags=all_flags[:2],
        private_flags=all_flags[2:],
        detected_data=job["data"]
    )
