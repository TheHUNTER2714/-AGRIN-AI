from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FarmLocation(BaseModel):
    state: str = "Uttar Pradesh"
    district: str = "Pratapgarh"
    block: Optional[str] = "Patti"
    village: Optional[str] = "Raniganj"
    latitude: float = 25.92
    longitude: float = 81.99
    farm_name: str = "Ayush Farm (Plot A-D)"
    area_hectares: float = 14.2
    polygon: Optional[List[List[float]]] = None

class SoilData(BaseModel):
    ph: float = 7.4
    nitrogen: float = 185.0 # kg/ha
    phosphorus: float = 24.5 # kg/ha
    potassium: float = 340.0 # kg/ha
    organic_carbon: float = 0.58 # %
    moisture_percentage: float = 28.0 # %

class WeatherData(BaseModel):
    temperature_c: float
    rain_probability: int
    rainfall_mm: float
    humidity_percent: int
    wind_kmh: float
    forecast_summary: str
    timestamp: str
    source: str

class SatelliteData(BaseModel):
    satellite: str = "Sentinel-2 MSI (Copernicus / ESA)"
    observation_date: str
    cloud_cover_percent: float
    ndvi: float
    ndwi: float
    vegetation_health_index: float
    source: str

class AdvisorRequest(BaseModel):
    question: str
    crop: str = "Sharbati Wheat (Triticum aestivum)"
    growth_stage: str = "Vegetative Tillering"
    location: Optional[FarmLocation] = None
    soil: Optional[SoilData] = None
    weather: Optional[WeatherData] = None
    satellite: Optional[SatelliteData] = None
    language: str = "en" # 'en', 'hi', or other Indic languages

class AdvisorResponse(BaseModel):
    advice: str
    reasoning: str
    confidence: float
    action_items: List[str]
    warnings: List[str]
    data_sources: List[str]
    timestamp: str
    mode: str # 'live_gemini' or 'demo_fallback'
    disclaimer: str = "AI-generated preliminary advisory — field/agronomist confirmation recommended."

class CropDoctorResponse(BaseModel):
    crop_identified: str
    condition: str
    is_healthy: bool
    confidence: float
    severity: str # 'None', 'Low', 'Medium', 'High', 'Critical'
    symptoms: List[str]
    biological_treatment: List[str]
    chemical_treatment: List[str]
    prevention: List[str]
    mode: str # 'live_gemini' or 'demo_fallback'
    disclaimer: str = "AI-generated preliminary diagnosis — field/agronomist confirmation recommended."
    timestamp: str
    data_sources: List[str]

class RiskEngineResponse(BaseModel):
    composite_risk_score: int # 0 - 100
    risk_level: str # 'Low', 'Moderate', 'High', 'Severe'
    factor_breakdown: Dict[str, float]
    early_warnings: List[Dict[str, Any]]
    explainability: Dict[str, Any]
    data_sources: List[str]
    timestamp: str

class SoilAnalysisRequest(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    organic_carbon: float
    moisture: Optional[float] = 28.0
    crop: Optional[str] = "Wheat"

class SoilAnalysisResponse(BaseModel):
    ph_status: str
    nitrogen_status: str
    phosphorus_status: str
    potassium_status: str
    carbon_status: str
    recommendations: List[str]
    regenerative_actions: List[str]
    fertilizer_adjustments: List[str]
    data_source: str
    timestamp: str

class VoiceQueryRequest(BaseModel):
    transcript: str
    language: str = "hi"
    crop: Optional[str] = "Wheat"
    location: Optional[str] = "Pratapgarh, UP"

class VoiceQueryResponse(BaseModel):
    answer_text: str
    language: str
    confidence: float
    suggested_actions: List[str]
    mode: str
    timestamp: str
