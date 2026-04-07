import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import AsyncSessionLocal
from app.models import SyncJob
import random

class SyncEngine:
    async def run_sync_simulation(self, job_id: str):
        # We use a fresh session for the background task
        async with AsyncSessionLocal() as db:
            # 1. Ramp up to 90% (Success Preview)
            platforms = ["Google Business", "Facebook", "Instagram", "Apple Maps", "Bing Places"]
            platform_status = {p: "pending" for p in platforms}

            for i in range(10, 91, 10):
                await asyncio.sleep(2) # Simulate work
                
                # Randomly mark some platforms as "validated" or "ready"
                if i > 30:
                    platform_status[platforms[0]] = "ready"
                if i > 60:
                    platform_status[platforms[1]] = "ready"

                await db.execute(
                    update(SyncJob)
                    .where(SyncJob.id == job_id)
                    .values(progress=i, platform_status=platform_status.copy())
                )
                await db.commit()

            # 2. Wait at 90% for "Paid" status (Simulated Stripe)
            # In a real app, the Stripe Webhook would update this.
            # Here we just stop and wait or wait a bit.
            # To make it interactive for the user, we keep it at "processing" 
            # until the frontend triggers a 'payment simulation' (Modul 2 detail).
            
    async def complete_sync(self, job_id: str):
        async with AsyncSessionLocal() as db:
            await db.execute(
                update(SyncJob)
                .where(SyncJob.id == job_id)
                .values(status="completed", progress=100)
            )
            # Mark all as success
            result = await db.execute(select(SyncJob).where(SyncJob.id == job_id))
            job = result.scalars().first()
            if job:
                ps = {k: "success" for k in job.platform_status.keys()}
                job.platform_status = ps
            
            await db.commit()
