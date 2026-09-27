import threading
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List

from backend.routes.farms import DEMO_FARM

logger = logging.getLogger(__name__)

class FarmContextEngine:
    """
    Unified Multi-Sensor Farm Context Engine:
    Fuses Farm Location & Boundaries, Crop Phenology, In-situ Soil Chemistry,
    Live Atmospheric Weather Radar, Sentinel-2 Multispectral Telemetry,
    and Gemini Multimodal Crop Doctor Pathology into one cohesive intelligence object.
    """
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self._current_farm: Dict[str, Any] = DEMO_FARM.copy()
        self._latest_diagnosis: Optional[Dict[str, Any]] = None
        self._custom_overrides: Dict[str, Any] = {}
        self._last_satellite: Optional[Dict[str, Any]] = None
        self._last_weather: Optional[Dict[str, Any]] = None

    @classmethod
    def get_instance(cls) -> "FarmContextEngine":
        with cls._lock:
            if cls._instance is None:
                cls._instance = FarmContextEngine()
            return cls._instance

    def update_diagnosis(self, diagnosis: Dict[str, Any]) -> None:
        """Stores the latest Crop Doctor leaf vision diagnosis in the unified context."""
        with self._lock:
            self._latest_diagnosis = diagnosis
            logger.info(f"Unified Context updated with Crop Doctor diagnosis: {diagnosis.get('disease_name')}")

    def get_latest_diagnosis(self) -> Optional[Dict[str, Any]]:
        with self._lock:
            return self._latest_diagnosis

    def update_farm_profile(
        self,
        farm_id: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        polygon: Optional[List[List[float]]] = None,
        crop: Optional[str] = None,
        growth_stage: Optional[str] = None,
        soil: Optional[Dict[str, Any]] = None
    ) -> None:
        """Updates farm boundaries, crop stage, or soil sensors."""
        with self._lock:
            if farm_id:
                self._current_farm["farm_id"] = farm_id
            if latitude is not None:
                self._current_farm["latitude"] = latitude
            if longitude is not None:
                self._current_farm["longitude"] = longitude
            if polygon is not None:
                self._current_farm["polygon_boundary"] = polygon
            if crop:
                self._current_farm["primary_crop"] = crop
            if growth_stage:
                self._custom_overrides["growth_stage"] = growth_stage
            if soil:
                self._current_farm["soil_health"] = soil

    def build_unified_context(
        self,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        polygon: Optional[List[List[float]]] = None,
        crop: Optional[str] = None,
        growth_stage: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Builds and returns the complete unified Farm Context object
        fusing Satellite, Weather, Soil, Crop Doctor, and Location.
        """
        # Lazy imports to avoid circular dependencies
        from backend.services.satellite import fetch_sentinel2_observation
        from backend.services.weather import fetch_live_weather

        latitude = lat if lat is not None else self._current_farm.get("latitude", 25.92)
        longitude = lon if lon is not None else self._current_farm.get("longitude", 81.99)
        poly = polygon if polygon is not None else self._current_farm.get("polygon_boundary")
        farm_crop = crop or self._current_farm.get("primary_crop", "Sharbati Wheat (Triticum aestivum)")
        stage = growth_stage or self._custom_overrides.get("growth_stage", "Vegetative Tillering")

        now_str = datetime.now().strftime("%d %b %Y, %H:%M IST")

        # 1. Satellite observation
        satellite_data = fetch_sentinel2_observation(
            latitude=latitude,
            longitude=longitude,
            polygon=poly,
            farm_id=self._current_farm.get("farm_id", "plotA")
        )
        self._last_satellite = satellite_data

        # 2. Weather observation
        location_label = f"{self._current_farm.get('district', 'Pratapgarh')}, {self._current_farm.get('state', 'Uttar Pradesh')}"
        weather_data = fetch_live_weather(
            latitude=latitude,
            longitude=longitude,
            location_name=location_label
        )
        self._last_weather = weather_data

        # 3. Soil data
        soil_data = self._current_farm.get("soil_health", {
            "ph": 7.4,
            "nitrogen": 185.0,
            "phosphorus": 24.5,
            "potassium": 340.0,
            "organic_carbon": 0.58,
            "moisture": 28.0
        })

        # Map soil fields to schema
        soil_dict = {
            "ph": float(soil_data.get("ph", 7.4)),
            "nitrogen": float(soil_data.get("nitrogen", 185.0)),
            "phosphorus": float(soil_data.get("phosphorus", 24.5)),
            "potassium": float(soil_data.get("potassium", 340.0)),
            "organic_carbon": float(soil_data.get("organic_carbon", 0.58)),
            "moisture_percentage": float(soil_data.get("moisture", 28.0))
        }

        # 4. Location details
        location_dict = {
            "state": self._current_farm.get("state", "Uttar Pradesh"),
            "district": self._current_farm.get("district", "Pratapgarh"),
            "block": self._current_farm.get("block", "Patti"),
            "village": self._current_farm.get("village", "Raniganj"),
            "latitude": latitude,
            "longitude": longitude,
            "farm_name": self._current_farm.get("farm_name", "Ayush Demo Farm (Plot A-D)"),
            "area_hectares": float(self._current_farm.get("area_ha", 14.2)),
            "polygon": poly
        }

        return {
            "farm_id": self._current_farm.get("farm_id", "demo-farm-01"),
            "farm_name": self._current_farm.get("farm_name", "Ayush Demo Farm (Plot A-D)"),
            "location": location_dict,
            "crop": farm_crop,
            "variety": "PBW-343 / Sharbati",
            "growth_stage": stage,
            "days_after_sowing": 28,
            "soil": soil_dict,
            "weather": weather_data,
            "satellite": satellite_data,
            "crop_doctor": self._latest_diagnosis,
            "updated_at": now_str,
            "context_source": "AgriN Unified Multi-Sensor Context Engine"
        }

# Global accessor convenience functions
def get_current_farm_context(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    polygon: Optional[List[List[float]]] = None,
    crop: Optional[str] = None,
    growth_stage: Optional[str] = None
) -> Dict[str, Any]:
    return FarmContextEngine.get_instance().build_unified_context(
        lat=lat, lon=lon, polygon=polygon, crop=crop, growth_stage=growth_stage
    )

def register_crop_diagnosis(diagnosis: Dict[str, Any]) -> None:
    FarmContextEngine.get_instance().update_diagnosis(diagnosis)

def sync_farm_context_profile(
    farm_id: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    polygon: Optional[List[List[float]]] = None,
    crop: Optional[str] = None,
    growth_stage: Optional[str] = None,
    soil: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    engine = FarmContextEngine.get_instance()
    engine.update_farm_profile(
        farm_id=farm_id,
        latitude=latitude,
        longitude=longitude,
        polygon=polygon,
        crop=crop,
        growth_stage=growth_stage,
        soil=soil
    )
    return engine.build_unified_context()
