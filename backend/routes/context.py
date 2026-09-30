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

@router.get("/change", response_model=Dict[str, Any])
async def get_farm_change_detection():
    """
    Computes delta telemetry comparing current farm observations against
    the previous observation cycle (NDVI, NDWI, soil moisture, rain delta, disease signal).
    """
    from backend.services.farm_context import compute_farm_change_detection
    return compute_farm_change_detection()

@router.get("/provenance", response_model=Dict[str, Any])
async def get_data_provenance():
    """
    Returns auditable data provenance and methodology for all core telemetry.
    """
    from backend.services.farm_context import get_data_provenance_registry
    return get_data_provenance_registry()

@router.get("/interventions", response_model=Dict[str, Any])
async def get_intervention_options():
    """
    Compares 3 distinct management interventions using deterministic risk calculations
    and transparent trade-offs.
    """
    from backend.services.farm_context import get_intervention_comparison
    return get_intervention_comparison()

@router.get("/status", response_model=Dict[str, Any])
async def get_system_status():
    """
    Returns real-time status of all backend subsystems (Gemini, Weather, Earth Engine, Risk, Voice, BRICS).
    """
    from backend.services.farm_context import get_system_subsystems_status
    return get_system_subsystems_status()

