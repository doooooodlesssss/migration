from fastapi import APIRouter, HTTPException
from app.models.migration import PatternSearchQuery
from app.services.vector_search import find_similar_patterns

router = APIRouter()
@router.post("/search/patterns")
async def search_similar_patterns(query: PatternSearchQuery):
    try:
        print("Received query:", query.dict())  # Debug log
        
        # Add input validation
        if not query.country_of_origin:
            raise HTTPException(status_code=400, detail="Country of origin is required")
            
        results = find_similar_patterns(
            target_country=query.country_of_origin,
            year_range=query.year_range,
            min_refugees=query.min_refugees
        )
        
        return {
            "status": "success",
            "query": query.dict(),
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        print("Search error:", str(e))  # Debug log
        raise HTTPException(status_code=500, detail=str(e))