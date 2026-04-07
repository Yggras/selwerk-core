from fastapi import FastAPI

app = FastAPI(title="Digital Janitor API", version="1.0.0")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
