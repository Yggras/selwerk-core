from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.audit.router import router as audit_router
from app.modules.sync.router import router as sync_router
from app.database import engine, Base
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Digital Janitor API", version="1.0.0", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit_router)
app.include_router(sync_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
