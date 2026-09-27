from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from backend.services.satellite import fetch_sentinel2_observation

router = APIRouter(prefix="/api/satellite", tags=["Satellite"])

@router.get("", response_model=Dict[str, Any])
async def get_satellite_data(
    lat: float = Query(25.92, description="Latitude"),
    lon: float = Query(81.99, description="Longitude"),
    farm_id: Optional[str] = Query("plotA", description="Farm / Plot ID")
):
    """
    Returns latest available Sentinel-2 MSI observation, cloud cover,
    calibrated NDVI / NDWI, and 6-cycle observation time series for the Farm Time Machine.
    """
    return fetch_sentinel2_observation(latitude=lat, longitude=lon, farm_id=farm_id)
