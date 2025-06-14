from fastapi import APIRouter, HTTPException
from app.models.migration import PatternSearchQuery
from app.services.vector_search import find_similar_patterns

router = APIRouter()

@router.post("/search/patterns")
async def search_similar_patterns(query: PatternSearchQuery):
    try:
        results = find_similar_patterns(
            target_country=query.country_of_origin,
            year_range=query.year_range,
            min_refugees=query.min_refugees
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))