from fastapi import APIRouter, HTTPException
from app.database import migration_collection
from datetime import datetime

router = APIRouter()

@router.get("/analytics/summary")
async def get_summary_analytics():
    try:
        # 1. Verify collection exists
        if "migration_data" not in await migration_collection.database.list_collection_names():
            raise HTTPException(status_code=404, detail="Collection not found")

        # 2. Get refugees by year (with proper field names)
        refugees_by_year = list(migration_collection.aggregate([
            {
                "$group": {
                    "_id": "$Year",  # Match exact field name in DB
                    "total_refugees": {
                        "$sum": {
                            "$ifNull": [
                                {"$toInt": "$Refugees"},  # Simplified conversion
                                0
                            ]
                        }
                    }
                }
            },
            {"$sort": {"_id": 1}}
        ]))

        # 3. Get top origins (with field name validation)
        top_origins = list(migration_collection.aggregate([
            {
                "$group": {
                    "_id": "$Country of Origin",  # Exact field name
                    "total_refugees": {
                        "$sum": {
                            "$ifNull": [
                                {"$toInt": "$Refugees"},
                                0
                            ]
                        }
                    }
                }
            },
            {"$sort": {"total_refugees": -1}},
            {"$limit": 5},
            {"$match": {"_id": {"$ne": None}}}  # Exclude null values
        ]))

        # 4. Get top asylums
        top_asylums = list(migration_collection.aggregate([
            {
                "$group": {
                    "_id": "$Country of Asylum",  # Exact field name
                    "total_refugees": {
                        "$sum": {
                            "$ifNull": [
                                {"$toInt": "$Refugees"},
                                0
                            ]
                        }
                    }
                }
            },
            {"$sort": {"total_refugees": -1}},
            {"$limit": 5},
            {"$match": {"_id": {"$ne": None}}}
        ]))

        # 5. Validate results
        if not refugees_by_year or not top_origins or not top_asylums:
            raise HTTPException(status_code=404, detail="No data found with current schema")

        return {
            "status": "success",
            "refugees_by_year": refugees_by_year,
            "top_origins": top_origins,
            "top_asylums": top_asylums,
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
@router.get("/analytics/country/{country_iso}")
async def get_country_analytics(country_iso: str):
    try:
        # As origin country
        origin_pipeline = [
            {"$match": {"Country of Origin ISO": country_iso}},  # Match exact field name
            {"$group": {
                "_id": "$Year",
                "refugees": {
                    "$sum": {
                        "$ifNull": [
                            {"$toInt": "$Refugees"},
                            0
                        ]
                    }
                },
                "asylum_seekers": {
                    "$sum": {
                        "$ifNull": [
                            {"$toInt": "$Asylum Seekers"},
                            0
                        ]
                    }
                }
            }},
            {"$sort": {"_id": 1}}
        ]
        
        # As asylum country
        asylum_pipeline = [
            {"$match": {"Country of Asylum ISO": country_iso}},  # Match exact field name
            {"$group": {
                "_id": "$Year",
                "refugees_received": {
                    "$sum": {
                        "$ifNull": [
                            {"$toInt": "$Refugees"},
                            0
                        ]
                    }
                },
                "asylum_seekers_received": {
                    "$sum": {
                        "$ifNull": [
                            {"$toInt": "$Asylum Seekers"},
                            0
                        ]
                    }
                }
            }},
            {"$sort": {"_id": 1}}
        ]

        origin_data = list(migration_collection.aggregate(origin_pipeline))
        asylum_data = list(migration_collection.aggregate(asylum_pipeline))

        if not origin_data and not asylum_data:
            raise HTTPException(status_code=404, detail="Country not found")

        return {
            "as_origin": origin_data,
            "as_asylum": asylum_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))