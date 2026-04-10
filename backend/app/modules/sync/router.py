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

RECOMMENDATION_METADATA_BY_FLAG = {
    "LEGAL_FORM_MISSING": {
        "category": "listing",
        "target_route": "/dashboard/profile",
        "cta_label": "Firmennamen korrigieren",
        "mission_key": "legal_form_missing",
    },
    "DUPLICATE_GOOGLE_LISTING": {
        "category": "listing",
        "target_route": "/dashboard/profile",
        "cta_label": "Duplikate bereinigen",
        "mission_key": "duplicate_google",
    },
    "INCONSISTENT_HOURS": {
        "category": "listing",
        "target_route": "/dashboard/profile",
        "cta_label": "Zeiten synchronisieren",
        "mission_key": "inconsistent_hours",
    },
    "MISSING_PHONE_COVERAGE": {
        "category": "listing",
        "target_route": "/dashboard/profile",
        "cta_label": "Nummer hinterlegen",
        "mission_key": "missing_phone",
    },
    "UNANSWERED_NEGATIVE_REVIEW": {
        "category": "reputation",
        "target_route": "/dashboard/reputation",
        "cta_label": "Jetzt antworten",
        "mission_key": "unanswered_review",
    },
    "LOW_AVERAGE_RATING": {
        "category": "reputation",
        "target_route": "/dashboard/reputation",
        "cta_label": "Strategie starten",
        "mission_key": "low_rating",
    },
    "LOW_REVIEW_RESPONSE_RATE": {
        "category": "reputation",
        "target_route": "/dashboard/reputation",
        "cta_label": "Antworten verbessern",
        "mission_key": "low_response_rate",
    },
    "FACEBOOK_NAME_MISMATCH": {
        "category": "social",
        "target_route": "/dashboard/social",
        "cta_label": "Profil angleichen",
        "mission_key": "facebook_mismatch",
    },
    "INSTAGRAM_INACTIVE": {
        "category": "social",
        "target_route": "/dashboard/social",
        "cta_label": "Posting planen",
        "mission_key": "instagram_inactive",
    },
    "LINKEDIN_UNCLAIMED": {
        "category": "social",
        "target_route": "/dashboard/social",
        "cta_label": "Seite beanspruchen",
        "mission_key": "linkedin_unclaimed",
    },
    "MOBILE_PAGESPEED_CRITICAL": {
        "category": "website",
        "target_route": "/dashboard/editor",
        "cta_label": "Performance verbessern",
        "mission_key": "pagespeed_critical",
    },
    "GDPR_BANNER_INVALID": {
        "category": "website",
        "target_route": "/dashboard/editor",
        "cta_label": "Banner absichern",
        "mission_key": "gdpr_banner",
    },
    "CONTACT_FORM_VALIDATION_BROKEN": {
        "category": "website",
        "target_route": "/dashboard/editor",
        "cta_label": "Formular reparieren",
        "mission_key": "contact_form_broken",
    },
}

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
        impact = 5
        if flag.severity == "high":
            impact = 15
        elif flag.severity == "medium":
            impact = 10

        metadata = RECOMMENDATION_METADATA_BY_FLAG.get(
            flag.type,
            {
                "category": "listing",
                "target_route": "/dashboard/profile",
                "cta_label": "Jetzt beheben",
                "mission_key": f"generic_{flag.type.lower()}",
            },
        )

        new_recs.append(GrowthRecommendation(
            profile_id=profile.id,
            title=flag.title,
            description=flag.description,
            category=metadata["category"],
            severity=flag.severity,
            platform=flag.platform,
            target_route=metadata["target_route"],
            cta_label=metadata["cta_label"],
            mission_key=metadata["mission_key"],
            impact=impact,
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
                category="reputation",
                severity="medium",
                platform="Google",
                target_route="/dashboard/reputation",
                cta_label="Antwort verfassen",
                mission_key="seed_review_reply",
                impact=10
            ),
            GrowthRecommendation(
                profile_id=profile.id,
                title="Lade ein aktuelles Foto deines Teams hoch",
                description="Persönlichkeit schafft Vertrauen. Ein aktuelles Bild erhöht Klicks um 20%.",
                category="social",
                severity="medium",
                platform="Instagram",
                target_route="/dashboard/social",
                cta_label="Foto-Update starten",
                mission_key="seed_team_photo",
                impact=15
            ),
            GrowthRecommendation(
                profile_id=profile.id,
                title="Öffnungszeiten für den nächsten Feiertag prüfen",
                description="Vermeide frustrierte Kunden vor verschlossenen Türen.",
                category="listing",
                severity="low",
                platform="Google",
                target_route="/dashboard/profile",
                cta_label="Zeiten prüfen",
                mission_key="seed_holiday_hours",
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
        .order_by(GrowthRecommendation.impact.desc(), GrowthRecommendation.created_at.desc())
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
