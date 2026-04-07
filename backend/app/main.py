from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.modules.audit.router import router as audit_router

app = FastAPI(title="Digital Janitor API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit_router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
