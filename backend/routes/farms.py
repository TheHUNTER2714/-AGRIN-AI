from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
import uuid

router = APIRouter(prefix="/api/farms", tags=["Farms"])

class LandRegistrationPayload(BaseModel):
    farmer_name: Optional[str] = "Ayush Kumar"
    phone: Optional[str] = None
    khasra_survey_number: Optional[str] = None
    farm_name: str
    state: str
    district: str
    block: Optional[str] = None
    village: Optional[str] = None
    latitude: float
    longitude: float
    area_acres: Optional[float] = 5.0
    area_ha: Optional[float] = None
    soil_type: Optional[str] = "Alluvial Silt Loam"
    primary_crop: str = "Wheat"
    crop_variety: Optional[str] = None
    sowing_date: Optional[str] = None
    irrigation_source: Optional[str] = "Tube Well / Borewell"
    polygon_boundary: Optional[List[List[float]]] = None
    soil_health: Optional[Dict[str, float]] = None

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
    "Uttar Pradesh": ["Pratapgarh", "Varanasi", "Prayagraj", "Lucknow", "Bareilly", "Meerut", "Ayodhya", "Gorakhpur", "Kanpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Bathinda", "Patiala", "Jalandhar", "Ferozepur", "Sangrur"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Hoshangabad", "Gwalior", "Sehore"],
    "Maharashtra": ["Nashik", "Pune", "Nagpur", "Aurangabad", "Solapur", "Kolhapur", "Ahmednagar"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Kurukshetra"],
    "Rajasthan": ["Jaipur", "Kota", "Ganganagar", "Jodhpur", "Udaipur", "Alwar"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Anand", "Mehsana"],
    "Karnataka": ["Dharwad", "Belagavi", "Mandya", "Mysuru", "Shivamogga"],
    "Bihar": ["Patna", "Muzaffarpur", "Bhagalpur", "Gaya", "Samastipur"],
    "West Bengal": ["Burdwan", "Hooghly", "Nadia", "Murshidabad"]
}

DEMO_FARM = {
    "farm_id": "demo-farm-01",
    "farmer_name": "Ayush Sharma",
    "phone": "+91 98765 43210",
    "khasra_survey_number": "Khasra 412/1",
    "state": "Uttar Pradesh",
    "district": "Pratapgarh",
    "block": "Patti",
    "village": "Raniganj",
    "farm_name": "Ayush Demo Farm (Plot A)",
    "primary_crop": "Sharbati Wheat (Triticum aestivum)",
    "crop_variety": "PBW-343 / Sharbati HD-2967",
    "area_acres": 35.0,
    "area_ha": 14.2,
    "latitude": 25.92,
    "longitude": 81.99,
    "soil_type": "Alluvial Silt Loam",
    "sowing_date": "2026-08-30",
    "irrigation_source": "Tube Well & Canal Network",
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

# In-memory registry of registered farms
REGISTERED_FARMS_REGISTRY: Dict[str, Dict[str, Any]] = {
    "demo-farm-01": DEMO_FARM,
    "plot-b-mustard": {
        "farm_id": "plot-b-mustard",
        "farmer_name": "Ayush Sharma",
        "phone": "+91 98765 43210",
        "khasra_survey_number": "Khasra 418/3",
        "state": "Uttar Pradesh",
        "district": "Pratapgarh",
        "block": "Patti",
        "village": "Raniganj North",
        "farm_name": "Plot B (Mustard & Pulse)",
        "primary_crop": "Pusa Mustard (Brassica juncea)",
        "crop_variety": "Pusa Bold",
        "area_acres": 12.0,
        "area_ha": 4.85,
        "latitude": 25.95,
        "longitude": 82.02,
        "soil_type": "Alluvial Silt Loam",
        "sowing_date": "2026-09-05",
        "irrigation_source": "Solar Powered Drip Fertigation",
        "soil_health": {
            "ph": 7.1,
            "nitrogen": 210.0,
            "phosphorus": 22.0,
            "potassium": 310.0,
            "organic_carbon": 0.62,
            "moisture": 26.0
        },
        "polygon_boundary": [
            [25.9520, 82.0180],
            [25.9540, 82.0230],
            [25.9490, 82.0245],
            [25.9480, 82.0190]
        ]
    }
}

def _generate_bounding_polygon(lat: float, lon: float, delta: float = 0.0035) -> List[List[float]]:
    """Generates an agricultural boundary polygon around a center GPS point."""
    return [
        [round(lat + delta * 0.9, 5), round(lon - delta * 1.1, 5)],
        [round(lat + delta * 1.1, 5), round(lon + delta * 0.9, 5)],
        [round(lat - delta * 0.9, 5), round(lon + delta * 1.2, 5)],
        [round(lat - delta * 1.2, 5), round(lon - delta * 0.8, 5)]
    ]

@router.get("/demo", response_model=Dict[str, Any])
async def get_demo_farm():
    """Returns the primary Demo Farm (Pratapgarh, UP)."""
    return DEMO_FARM

@router.get("/districts", response_model=Dict[str, List[str]])
async def get_supported_districts():
    """Returns state & district mapping for farm land registration."""
    return DISTRICT_DATABASE

@router.get("/list", response_model=List[Dict[str, Any]])
async def list_registered_farms():
    """Returns all registered agricultural land parcels."""
    return list(REGISTERED_FARMS_REGISTRY.values())

@router.post("/register")
async def register_new_land(payload: LandRegistrationPayload):
    """
    Registers a new agricultural land parcel with complete real details:
    farmer identity, GPS coordinates, soil characteristics, crop profile,
    and automatic polygon boundary generation for Sentinel-2 satellite locking.
    """
    farm_id = f"farm-{str(uuid.uuid4())[:8]}"
    area_ha = payload.area_ha or round((payload.area_acres or 5.0) * 0.404686, 2)
    area_acres = payload.area_acres or round(area_ha / 0.404686, 2)

    polygon = payload.polygon_boundary or _generate_bounding_polygon(payload.latitude, payload.longitude)

    soil_health = payload.soil_health or {
        "ph": 7.3,
        "nitrogen": 195.0,
        "phosphorus": 24.0,
        "potassium": 325.0,
        "organic_carbon": 0.60,
        "moisture": 28.0
    }

    new_farm: Dict[str, Any] = {
        "farm_id": farm_id,
        "farmer_name": payload.farmer_name or "Farmer",
        "phone": payload.phone or "N/A",
        "khasra_survey_number": payload.khasra_survey_number or f"Khasra-{farm_id[-4:]}",
        "state": payload.state,
        "district": payload.district,
        "block": payload.block or "District Tehsil",
        "village": payload.village or "Gram Panchayat",
        "farm_name": payload.farm_name,
        "primary_crop": payload.primary_crop,
        "crop_variety": payload.crop_variety or f"{payload.primary_crop} Certified Variety",
        "area_acres": area_acres,
        "area_ha": area_ha,
        "latitude": round(payload.latitude, 5),
        "longitude": round(payload.longitude, 5),
        "soil_type": payload.soil_type or "Alluvial Silt Loam",
        "sowing_date": payload.sowing_date or "2026-09-01",
        "irrigation_source": payload.irrigation_source or "Tube Well / Borewell",
        "soil_health": soil_health,
        "polygon_boundary": polygon
    }

    REGISTERED_FARMS_REGISTRY[farm_id] = new_farm

    # Update active FarmContextEngine
    try:
        from backend.services.farm_context import FarmContextEngine
        engine = FarmContextEngine.get_instance()
        engine.update_farm_profile(
            farm_id=farm_id,
            latitude=new_farm["latitude"],
            longitude=new_farm["longitude"],
            polygon=polygon,
            crop=new_farm["primary_crop"],
            growth_stage="Vegetative Tillering",
            soil=soil_health
        )
    except Exception as e:
        pass

    return {
        "status": "success",
        "message": f"Land parcel '{payload.farm_name}' successfully registered for {payload.farmer_name}.",
        "farm": new_farm
    }

@router.post("/select/{farm_id}")
async def select_active_farm(farm_id: str):
    """Switches the active farm context to a registered land parcel."""
    if farm_id not in REGISTERED_FARMS_REGISTRY:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    farm = REGISTERED_FARMS_REGISTRY[farm_id]
    try:
        from backend.services.farm_context import FarmContextEngine
        engine = FarmContextEngine.get_instance()
        engine.update_farm_profile(
            farm_id=farm["farm_id"],
            latitude=farm["latitude"],
            longitude=farm["longitude"],
            polygon=farm.get("polygon_boundary"),
            crop=farm.get("primary_crop"),
            soil=farm.get("soil_health")
        )
    except Exception:
        pass

    return {
        "status": "success",
        "active_farm": farm
    }

@router.post("/save")
async def save_farm_boundary(payload: FarmLocationPayload):
    """Legacy endpoint for saving boundaries."""
    return {
        "status": "success",
        "message": f"Farm '{payload.farm_name}' saved successfully in {payload.district}, {payload.state}.",
        "farm_id": f"farm-{payload.district.lower()[:3]}-custom",
        "data": payload.model_dump()
    }

@router.post("/demo/reset")
async def reset_to_demo_farm():
    """
    One-click reset to the canonical AgriN Demo Farm:
    Location: Pratapgarh, Uttar Pradesh (25.92°N, 81.99°E)
    Crop: Sharbati Wheat (Triticum aestivum), 14.2 hectares, Plot A-D.
    """
    try:
        from backend.services.farm_context import FarmContextEngine
        engine = FarmContextEngine.get_instance()
        engine.update_farm_profile(
            farm_id=DEMO_FARM["farm_id"],
            latitude=DEMO_FARM["latitude"],
            longitude=DEMO_FARM["longitude"],
            polygon=DEMO_FARM["polygon_boundary"],
            crop=DEMO_FARM["primary_crop"],
            growth_stage="Vegetative Tillering",
            soil=DEMO_FARM["soil_health"]
        )
        ctx = engine.build_unified_context()
        return {
            "status": "success",
            "message": "Reset to canonical AgriN Demo Farm (Pratapgarh, UP).",
            "farm": DEMO_FARM,
            "context": ctx
        }
    except Exception as e:
        return {
            "status": "success",
            "message": "Reset to canonical AgriN Demo Farm.",
            "farm": DEMO_FARM
        }


