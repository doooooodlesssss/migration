from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analytics, reports
import uvicorn
from app.database import import_data_from_csv, get_collection  # <-- Fix here
# from app.database import import_data_from_csv
import os

app = FastAPI(title="Global Migration & Refugee Movement Insight Tool")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    # Import data from CSV if collection is empty
    collection = get_collection("migration_data")
    if collection.count_documents({}) == 0:
        import_data_from_csv("data/migration_data.csv")

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)



