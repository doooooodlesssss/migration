from fastapi import APIRouter, HTTPException
from app.database import migration_collection
import pandas as pd
from datetime import datetime

router = APIRouter()

@router.get("/analytics/summary")
async def get_summary_analytics():
    try:
        # Get total refugees by year
        pipeline = [
            {"$group": {"_id": "$year", "total_refugees": {"$sum": "$refugees"}}},
            {"$sort": {"_id": 1}}
        ]
        refugees_by_year = list(migration_collection.aggregate(pipeline))
        
        # Get top origin countries
        pipeline = [
            {"$group": {"_id": "$country_of_origin", "total_refugees": {"$sum": "$refugees"}}},
            {"$sort": {"total_refugees": -1}},
            {"$limit": 5}
        ]
        top_origins = list(migration_collection.aggregate(pipeline))
        
        # Get top asylum countries
        pipeline = [
            {"$group": {"_id": "$country_of_asylum", "total_refugees": {"$sum": "$refugees"}}},
            {"$sort": {"total_refugees": -1}},
            {"$limit": 5}
        ]
        top_asylums = list(migration_collection.aggregate(pipeline))
        
        return {
            "refugees_by_year": refugees_by_year,
            "top_origins": top_origins,
            "top_asylums": top_asylums
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/country/{country_iso}")
async def get_country_analytics(country_iso: str):
    try:
        # As origin country
        origin_pipeline = [
            {"$match": {"country_of_origin_iso": country_iso}},
            {"$group": {
                "_id": "$year",
                "refugees": {"$sum": "$refugees"},
                "asylum_seekers": {"$sum": "$asylum_seekers"}
            }},
            {"$sort": {"_id": 1}}
        ]
        origin_data = list(migration_collection.aggregate(origin_pipeline))
        
        # As asylum country
        asylum_pipeline = [
            {"$match": {"country_of_asylum_iso": country_iso}},
            {"$group": {
                "_id": "$year",
                "refugees_received": {"$sum": "$refugees"},
                "asylum_seekers_received": {"$sum": "$asylum_seekers"}
            }},
            {"$sort": {"_id": 1}}
        ]
        asylum_data = list(migration_collection.aggregate(asylum_pipeline))
        
        return {
            "as_origin": origin_data,
            "as_asylum": asylum_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))