from fastapi import APIRouter, Query, Body
from typing import Dict, Any, Optional
from backend.models.schemas import FarmContext, FarmContextSyncRequest
from backend.services.farm_context import get_current_farm_context, sync_farm_context_profile

router = APIRouter(prefix="/api/context", tags=["Farm Context"])

@router.get("", response_model=FarmContext)
async def get_farm_context(
    lat: Optional[float] = Query(None, description="Optional override latitude"),
    lon: Optional[float] = Query(None, description="Optional override longitude"),
    crop: Optional[str] = Query(None, description="Optional override crop"),
    growth_stage: Optional[str] = Query(None, description="Optional override growth stage")
):
    """
    Returns the unified AgriN Farm Context object fusing Satellite telemetry,
    live weather radar, in-situ soil chemistry, and Crop Doctor pathology.
    """
    context = get_current_farm_context(
        lat=lat,
        lon=lon,
        crop=crop,
        growth_stage=growth_stage
    )
    return FarmContext(**context)

@router.post("/sync", response_model=FarmContext)
async def sync_farm_context(
    payload: FarmContextSyncRequest = Body(...)
):
    """
    Updates the active farm profile parameters and returns the freshly re-computed unified context.
    """
    soil_dict = payload.soil.model_dump() if payload.soil else None
    context = sync_farm_context_profile(
        farm_id=payload.farm_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        polygon=payload.polygon,
        crop=payload.crop,
        growth_stage=payload.growth_stage,
        soil=soil_dict
    )
    return FarmContext(**context)
