from fastapi import APIRouter, Query, Body
from typing import Dict, Any, Optional
from backend.models.schemas import SatelliteData, SatelliteRequest
from backend.services.satellite import fetch_sentinel2_observation, get_earth_engine_status

router = APIRouter(prefix="/api/satellite", tags=["Satellite"])

@router.get("", response_model=SatelliteData)
async def get_satellite_data(
    lat: float = Query(25.92, description="Latitude"),
    lon: float = Query(81.99, description="Longitude"),
    farm_id: Optional[str] = Query("plotA", description="Farm / Plot ID"),
    mode: Optional[str] = Query(None, description="Preferred source mode: LIVE, DEMO, CALCULATED, or SIMULATION")
):
    """
    Returns latest available Sentinel-2 MSI observation, cloud cover,
    calibrated NDVI / NDWI, vegetation trend, and 6-cycle observation time series.
    Queries Google Earth Engine when credentials are configured, or returns explicit
    CALCULATED / DEMO / SIMULATION state.
    """
    result = fetch_sentinel2_observation(
        latitude=lat,
        longitude=lon,
        farm_id=farm_id,
        mode_preference=mode
    )
    return SatelliteData(**result)

@router.post("", response_model=SatelliteData)
async def query_satellite_data(
    req: SatelliteRequest = Body(...)
):
    """
    Advanced Sentinel-2 endpoint supporting polygon farm boundaries,
    custom cloud thresholds, and explicit source states.
    """
    result = fetch_sentinel2_observation(
        latitude=req.latitude,
        longitude=req.longitude,
        polygon=req.polygon,
        farm_id=req.farm_id,
        cloud_threshold=req.cloud_threshold or 25.0,
        mode_preference=req.mode_preference
    )
    return SatelliteData(**result)

@router.get("/status")
async def get_satellite_pipeline_status():
    """
    Returns diagnostic telemetry for Google Earth Engine connectivity and credentials.
    """
    return get_earth_engine_status()
