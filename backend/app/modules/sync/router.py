from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.models import User, Profile, SyncJob
from .schemas import ProfileUpdate, ProfileResponse, SyncTriggerRequest, SyncStatusResponse
from .engine import SyncEngine
from typing import Optional
import uuid

router = APIRouter(prefix="/sync", tags=["Magic Sync"])
engine = SyncEngine()

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    shadow_id: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not shadow_id:
        raise HTTPException(status_code=400, detail="Missing Shadow-ID")
    
    result = await db.execute(select(Profile).where(Profile.shadow_id == shadow_id))
    profile = result.scalars().first()
    
    if not profile:
        # Create initial empty profile for this shadow session
        profile = Profile(shadow_id=shadow_id, business_name="Dein Unternehmen")
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    
    return profile

@router.post("/profile", response_model=ProfileResponse)
async def update_profile(
    data: ProfileUpdate,
    shadow_id: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not shadow_id:
        raise HTTPException(status_code=400, detail="Missing Shadow-ID")

    result = await db.execute(select(Profile).where(Profile.shadow_id == shadow_id))
    profile = result.scalars().first()

    if not profile:
        profile = Profile(shadow_id=shadow_id, **data.dict())
        db.add(profile)
    else:
        for key, value in data.dict().items():
            setattr(profile, key, value)
    
    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/trigger", response_model=SyncStatusResponse)
async def trigger_sync(
    request: SyncTriggerRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # 1. Ensure User exists (Shadow -> User migration)
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        user = User(email=request.email)
        db.add(user)
        await db.flush()

    # 2. Link Profile to User
    result = await db.execute(select(Profile).where(Profile.id == request.profile_id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.user_id = user.id
    
    # 3. Create Sync Job
    job = SyncJob(profile_id=profile.id, status="processing", progress=5)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    # 4. Start Mock Sync Engine in Background
    background_tasks.add_task(engine.run_sync_simulation, job.id)
    
    return SyncStatusResponse(
        job_id=job.id,
        status=job.status,
        progress=job.progress,
        platform_status=job.platform_status
    )

@router.get("/status/{job_id}", response_model=SyncStatusResponse)
async def get_sync_status(job_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SyncJob).where(SyncJob.id == job_id))
    job = result.scalars().first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return SyncStatusResponse(
        job_id=job.id,
        status=job.status,
        progress=job.progress,
        platform_status=job.platform_status
    )

@router.post("/simulate-payment/{job_id}")
async def simulate_payment(job_id: str, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SyncJob).where(SyncJob.id == job_id))
    job = result.scalars().first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = "paid"
    await db.commit()
    
    # Trigger final completion
    background_tasks.add_task(engine.complete_sync, job_id)
    
    return {"status": "payment_received"}
