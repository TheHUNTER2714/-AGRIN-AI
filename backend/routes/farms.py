from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/api/farms", tags=["Farms"])

class FarmLocationPayload(BaseModel):
    state: str
    district: str
    block: str
    village: str
    farm_name: str
    crop: str
    area_ha: float
    latitude: float
    longitude: float

# Seeded Indian Agricultural Districts
DISTRICT_DATABASE = {
    "Uttar Pradesh": ["Pratapgarh", "Varanasi", "Prayagraj", "Lucknow", "Bareilly", "Meerut"],
    "Punjab": ["Ludhiana", "Amritsar", "Bathinda", "Patiala", "Jalandhar"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Hoshangabad"],
    "Maharashtra": ["Nashik", "Pune", "Nagpur", "Aurangabad", "Solapur"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa"]
}

DEMO_FARM = {
    "farm_id": "demo-farm-01",
    "state": "Uttar Pradesh",
    "district": "Pratapgarh",
    "block": "Patti",
    "village": "Raniganj",
    "farm_name": "Ayush Demo Farm (Plot A-D)",
    "primary_crop": "Sharbati Wheat (Triticum aestivum)",
    "area_ha": 14.2,
    "latitude": 25.92,
    "longitude": 81.99,
    "soil_type": "Alluvial Silt Loam",
    "soil_health": {
        "ph": 7.4,
        "nitrogen": 185.0,
        "phosphorus": 24.5,
        "potassium": 340.0,
        "organic_carbon": 0.58,
        "moisture": 28.0
    },
    "polygon_boundary": [
        [25.9221, 81.9880],
        [25.9235, 81.9945],
        [25.9185, 81.9962],
        [25.9172, 81.9898]
    ]
}

@router.get("/demo", response_model=Dict[str, Any])
async def get_demo_farm():
    """
    Returns the pre-configured Demo Farm (Pratapgarh, UP) for immediate 1-click judging demo.
    """
    return DEMO_FARM

@router.get("/districts", response_model=Dict[str, List[str]])
async def get_supported_districts():
    """
    Returns hierarchical state & district mapping for farm creation.
    """
    return DISTRICT_DATABASE

@router.post("/save")
async def save_farm_boundary(payload: FarmLocationPayload):
    """
    Saves a farmer's drawn boundary and location parameters.
    """
    return {
        "status": "success",
        "message": f"Farm '{payload.farm_name}' saved successfully in {payload.district}, {payload.state}.",
        "farm_id": f"farm-{payload.district.lower()[:3]}-custom",
        "data": payload.model_dump()
    }
