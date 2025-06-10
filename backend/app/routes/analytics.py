from fastapi import APIRouter, HTTPException
from app.database import get_collection
from app.models.migration import MigrationData
from typing import List
import pandas as pd
import json

router = APIRouter()

@router.get("/analytics/top-countries/{year}")
async def get_top_countries(year: int, limit: int = 10):
    collection = get_collection("migration_data")
    
    pipeline = [
        {"$match": {"year": year}},
        {"$group": {
            "_id": "$country_of_asylum",
            "total_refugees": {"$sum": "$refugees"},
            "total_asylum_seekers": {"$sum": "$asylum_seekers"}
        }},
        {"$sort": {"total_refugees": -1}},
        {"$limit": limit}
    ]
    
    results = list(collection.aggregate(pipeline))
    return results

@router.get("/analytics/trends/{country_iso}")
async def get_country_trends(country_iso: str):
    collection = get_collection("migration_data")
    
    query = {
        "$or": [
            {"country_of_asylum_iso": country_iso},
            {"country_of_origin_iso": country_iso}
        ]
    }
    
    results = list(collection.find(query, {"_id": 0}).sort("year", 1))
    
    # Convert to DataFrame for easier manipulation
    df = pd.DataFrame(results)
    
    # Group by year and sum values
    if not df.empty:
        trends = df.groupby('year').agg({
            'refugees': 'sum',
            'asylum_seekers': 'sum',
            'idps': 'sum'
        }).reset_index().to_dict('records')
        return trends
    else:
        raise HTTPException(status_code=404, detail="Country not found")
