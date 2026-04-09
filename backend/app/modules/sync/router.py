from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.models import User, Profile, SyncJob, GrowthRecommendation
from .schemas import (
    ProfileUpdate, ProfileResponse, SyncTriggerRequest, 
    SyncStatusResponse, RecommendationResponse, MagicLoginRequest, AuthResponse,
    AuditIngestRequest
)
from .engine import SyncEngine
from app.modules.audit.store import audit_store
from app.modules.audit.engine import RuleParser
from typing import Optional, List
import uuid

router = APIRouter(prefix="/sync", tags=["Magic Sync"])
engine = SyncEngine()

@router.post("/ingest-audit")
async def ingest_audit(
    request: AuditIngestRequest,
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch Audit Data
    if request.report_id not in audit_store:
        raise HTTPException(status_code=404, detail="Audit report not found in memory")
    
    audit_data = audit_store[request.report_id]
    if audit_data["status"] != "complete":
        raise HTTPException(status_code=400, detail="Audit is not complete yet")

    # 2. Find User and Profile
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please log in first.")

    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalars().first()
    if not profile:
        profile = Profile(user_id=user.id, business_name=audit_data.get("name", "Dein Business"))
        db.add(profile)
        await db.flush()

    # 3. Transform Red Flags to Recommendations
    all_flags = RuleParser.extract_red_flags(audit_data.get("data", {}), pedant=True)
    
    # Idempotenz: Clear existing pending recommendations to avoid duplicates on re-scan
    await db.execute(
        update(GrowthRecommendation)
        .where(GrowthRecommendation.profile_id == profile.id)
        .where(GrowthRecommendation.status == "pending")
        .values(status="obsolete")
    )

    new_recs = []
    for flag in all_flags:
        new_recs.append(GrowthRecommendation(
            profile_id=profile.id,
            title=flag.title,
            description=flag.description,
            impact=10 if flag.severity == "high" else 5,
            status="pending"
        ))
    
    db.add_all(new_recs)

    # 4. Update Digi-Score
    profile.digi_score = audit_data.get("data", {}).get("overall_score", 42)
    
    await db.commit()
    return {"status": "success", "recommendations_count": len(new_recs), "new_score": profile.digi_score}

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

@router.post("/auth/magic-login", response_model=AuthResponse)
async def magic_login(request: MagicLoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Find or Create User
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        user = User(email=request.email)
        db.add(user)
        await db.flush()
    
    # 2. Get the latest profile for this user
    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = Profile(
            user_id=user.id,
            business_name="Dein Business (Entwurf)",
            digi_score=42
        )
        db.add(profile)
        await db.flush()
    
    # 3. Seed recommendations if none exist
    res = await db.execute(select(GrowthRecommendation).where(GrowthRecommendation.profile_id == profile.id))
    if not res.scalars().first():
        seeds = [
            GrowthRecommendation(
                profile_id=profile.id,
                title="Antworte auf dein neuestes Google-Review",
                description="Kundenbindung steigern: Ein kurzes 'Danke' reicht oft aus.",
                impact=10
            ),
            GrowthRecommendation(
                profile_id=profile.id,
                title="Lade ein aktuelles Foto deines Teams hoch",
                description="Persönlichkeit schafft Vertrauen. Ein aktuelles Bild erhöht Klicks um 20%.",
                impact=15
            ),
            GrowthRecommendation(
                profile_id=profile.id,
                title="Öffnungszeiten für den nächsten Feiertag prüfen",
                description="Vermeide frustrierte Kunden vor verschlossenen Türen.",
                impact=5
            )
        ]
        db.add_all(seeds)
    
    await db.commit()
    
    return AuthResponse(
        email=user.email,
        token=f"mock_token_{uuid.uuid4().hex[:8]}",
        profile=profile
    )

@router.get("/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GrowthRecommendation)
        .join(Profile)
        .join(User)
        .where(User.email == email)
        .where(GrowthRecommendation.status == "pending")
        .limit(3)
    )
    return result.scalars().all()

@router.post("/recommendations/{rec_id}/complete")
async def complete_recommendation(
    rec_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GrowthRecommendation).where(GrowthRecommendation.id == rec_id))
    rec = result.scalars().first()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
        
    if rec.status == "completed":
        return {"status": "already_completed"}

    rec.status = "completed"
    
    # Update Digi-Score on Profile
    res = await db.execute(select(Profile).where(Profile.id == rec.profile_id))
    profile = res.scalars().first()
    if profile:
        profile.digi_score = min(profile.digi_score + rec.impact, 100)
    
    await db.commit()
    return {"new_score": profile.digi_score if profile else 0}
