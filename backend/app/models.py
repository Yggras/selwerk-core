from sqlalchemy import Column, String, Integer, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    stripe_customer_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    profiles = relationship("Profile", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True) # Nullable for Shadow Profiles
    shadow_id = Column(String, index=True, nullable=True) # UUID for anonymous editing
    
    # SSOT Data
    business_name = Column(String, nullable=False)
    address = Column(String)
    phone = Column(String)
    website = Column(String)
    hours = Column(JSON) # e.g. {"mon": "09:00-18:00", ...}
    
    digi_score = Column(Integer, default=42)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profiles")
    sync_jobs = relationship("SyncJob", back_populates="profile")
    recommendations = relationship("GrowthRecommendation", back_populates="profile")

class SyncJob(Base):
    __tablename__ = "sync_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    
    status = Column(String, default="pending") # pending, processing, paid, completed
    progress = Column(Integer, default=0)
    platform_status = Column(JSON, default={}) # {"google": "success", "facebook": "pending"...}
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("Profile", back_populates="sync_jobs")

class GrowthRecommendation(Base):
    __tablename__ = "growth_recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("profiles.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    platform = Column(String, nullable=True)
    target_route = Column(String, nullable=True)
    cta_label = Column(String, nullable=True)
    mission_key = Column(String, nullable=True)
    impact = Column(Integer, default=5) # Digi-Score increase
    status = Column(String, default="pending") # pending, completed

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="recommendations")
