from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analytics, search, reports
import uvicorn
from app.database import migration_collection
import pandas as pd
import os

app = FastAPI(title="Migration Insight Tool API",
              description="API for analyzing global migration and refugee patterns",
              version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_db_client():
    # Load initial data if collection is empty
    if migration_collection.count_documents({}) == 0:
        csv_path = os.path.join(os.path.dirname(__file__), "../../data/migration_data.csv")
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            df = df.where(pd.notnull(df), None)
            migration_collection.insert_many(df.to_dict('records'))
            print("Initial data loaded into MongoDB")

@app.get("/")
async def root():
    return {"message": "Migration Insight Tool API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)