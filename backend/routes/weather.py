from fastapi import APIRouter, Query
from typing import Dict, Any
from backend.services.weather import fetch_live_weather

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("", response_model=Dict[str, Any])
async def get_weather(
    lat: float = Query(25.92, description="Latitude"),
    lon: float = Query(81.99, description="Longitude"),
    location: str = Query("Pratapgarh, Uttar Pradesh", description="Location Display Name")
):
    """
    Returns real-time live surface weather, precipitation probability,
    and 7-day agricultural forecast from Open-Meteo.
    """
    return fetch_live_weather(latitude=lat, longitude=lon, location_name=location)
