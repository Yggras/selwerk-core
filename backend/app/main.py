from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.audit.router import router as audit_router
from app.modules.sync.router import router as sync_router
from app.database import engine, Base
from contextlib import asynccontextmanager
from sqlalchemy import inspect, text


def _ensure_growth_recommendation_columns(sync_conn):
    inspector = inspect(sync_conn)
    if "growth_recommendations" not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("growth_recommendations")
    }
    expected_columns = {
        "category": "VARCHAR",
        "severity": "VARCHAR",
        "platform": "VARCHAR",
        "target_route": "VARCHAR",
        "cta_label": "VARCHAR",
        "mission_key": "VARCHAR",
    }

    for column_name, column_type in expected_columns.items():
        if column_name in existing_columns:
            continue
        sync_conn.execute(
            text(
                f"ALTER TABLE growth_recommendations ADD COLUMN {column_name} {column_type}"
            )
        )

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Recreate tables for prototype schema updates
    async with engine.begin() as conn:
        await conn.run_sync(_ensure_growth_recommendation_columns)
        # await conn.run_sync(Base.metadata.drop_all) # UNCOMMENT IF SCHEMA CHANGE NEEDED
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
