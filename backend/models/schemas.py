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
    apparent_temp_c: Optional[float] = None
    rain_probability: int
    rainfall_mm: float
    humidity_percent: int
    wind_kmh: float
    condition: Optional[str] = "Clear / Mild"
    forecast_summary: str
    agro_advice: Optional[str] = None
    daily_forecast: Optional[List[Dict[str, Any]]] = None
    timestamp: str
    source: str
    mode: Optional[str] = "live_api"

class SatelliteData(BaseModel):
    satellite: str = "Sentinel-2 MSI (Copernicus / ESA)"
    label: str = "Latest available Sentinel-2 observation"
    observation_date: str
    cloud_cover_percent: float
    cloud_mask_applied: bool = True
    resolution_meters: float = 10.0
    ndvi: float
    ndwi: float
    vegetation_trend: str = "Stable"
    vegetation_health_index: float
    farm_statistics: Optional[Dict[str, Any]] = None
    source_state: str = "DEMO" # 'LIVE' | 'DEMO' | 'CALCULATED' | 'SIMULATION'
    is_live: bool = False
    bands: Optional[Dict[str, float]] = None
    time_series: Optional[List[Dict[str, Any]]] = None
    location: Optional[Dict[str, Any]] = None
    polygon: Optional[List[List[float]]] = None
    source: str = "Copernicus Open Access Hub / ESA Sentinel-2 MSI"
    provenance: Optional[str] = None
    timestamp: str = "Operational"
    mode: str = "demo_calibrated"

class SatelliteRequest(BaseModel):
    latitude: float = 25.92
    longitude: float = 81.99
    polygon: Optional[List[List[float]]] = None
    farm_id: Optional[str] = "plotA"
    cloud_threshold: Optional[float] = 25.0
    mode_preference: Optional[str] = None # 'LIVE' | 'DEMO' | 'CALCULATED' | 'SIMULATION'

class CropDoctorResponse(BaseModel):
    # 12 Structured Gemini Vision Fields
    crop_name: str
    leaf_name: str
    health_status: str
    disease_name: str
    confidence: float
    severity: str # 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
    symptoms: List[str]
    possible_causes: List[str]
    recommended_actions: List[str]
    prevention: List[str]
    image_quality: str
    needs_expert_confirmation: bool

    # Backward compatibility fields for existing UI components
    crop_identified: Optional[str] = None
    condition: Optional[str] = None
    is_healthy: Optional[bool] = None
    biological_treatment: Optional[List[str]] = None
    chemical_treatment: Optional[List[str]] = None

    # Trust and audit provenance
    source_state: str = "DEMO" # 'LIVE' | 'DEMO'
    mode: str = "demo_fallback" # 'live_gemini' | 'demo_fallback'
    model: Optional[str] = "Gemini Vision Diagnostic"
    prompt_version: Optional[str] = "AGRIN-VISION-v2"
    context_version: Optional[str] = "FarmContext-v1"
    disclaimer: str = "PRELIMINARY AI DIAGNOSIS — field/agronomist confirmation recommended. Verify high-risk treatment with local agronomist / KVK before application."
    timestamp: str
    data_sources: List[str]

class FarmContext(BaseModel):
    farm_id: str = "demo-farm-01"
    farm_name: str = "Ayush Demo Farm (Plot A-D)"
    location: FarmLocation
    crop: str = "Sharbati Wheat (Triticum aestivum)"
    variety: Optional[str] = "PBW-343 / Sharbati"
    growth_stage: str = "Vegetative Tillering"
    days_after_sowing: int = 28
    soil: SoilData
    weather: WeatherData
    satellite: SatelliteData
    crop_doctor: Optional[CropDoctorResponse] = None
    updated_at: str
    context_source: str = "AgriN Unified Multi-Sensor Context Engine"

class FarmContextSyncRequest(BaseModel):
    farm_id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    polygon: Optional[List[List[float]]] = None
    crop: Optional[str] = None
    growth_stage: Optional[str] = None
    soil: Optional[SoilData] = None

class AdvisorRequest(BaseModel):
    question: str
    crop: str = "Sharbati Wheat (Triticum aestivum)"
    growth_stage: str = "Vegetative Tillering"
    location: Optional[FarmLocation] = None
    soil: Optional[SoilData] = None
    weather: Optional[WeatherData] = None
    satellite: Optional[SatelliteData] = None
    crop_doctor: Optional[CropDoctorResponse] = None
    language: str = "en" # 'en', 'hi', or other Indic languages

class AdvisorResponse(BaseModel):
    advice: str
    reasoning: str
    confidence: float
    ai_confidence_percent: Optional[int] = 95
    data_confidence: Optional[str] = "High"
    uncertainty_factors: Optional[List[str]] = Field(default_factory=lambda: [
        "Precipitation radar updates within next 12 hours",
        "Next Sentinel-2 satellite observation pass",
        "Soil moisture probe re-calibration after rain",
        "Subsequent foliar pathology scan results"
    ])
    action_items: List[str]
    warnings: List[str]
    data_sources: List[str]
    model: Optional[str] = "Gemini Flash"
    prompt_version: Optional[str] = "AGRIN-ADVISOR-v3"
    context_version: Optional[str] = "FarmContext-v1"
    source_state: Optional[str] = "DEMO"
    timestamp: str
    mode: str # 'live_gemini' or 'demo_fallback'
    disclaimer: str = "AI-generated preliminary advisory — field/agronomist confirmation recommended. Verify high-risk treatment with local agronomist / KVK."

class RiskEngineResponse(BaseModel):
    composite_risk_score: int # 0 - 100
    risk_level: str # 'Low', 'Moderate', 'High', 'Severe'
    factor_breakdown: Dict[str, float]
    factor_explanations: Optional[Dict[str, str]] = None # factor-level explanations for weather, vegetation, water/soil, disease
    early_warnings: List[Dict[str, Any]]
    explainability: Dict[str, Any]
    context_snapshot: Optional[Dict[str, Any]] = None
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
    voice_query: Optional[str] = None
    farm_context_snapshot: Optional[Dict[str, Any]] = None
    gemini_reasoning: Optional[str] = None
    model: Optional[str] = "Gemini Flash"
    prompt_version: Optional[str] = "AGRIN-VOICE-v1"
    context_version: Optional[str] = "FarmContext-v1"
    source_state: Optional[str] = "LIVE"
    mode: str
    timestamp: str

class FarmChangeDetectionResponse(BaseModel):
    previous_observation_date: str
    current_observation_date: str
    ndvi_delta: float
    ndwi_delta: float
    soil_moisture_delta_percent: float
    rainfall_forecast_delta_mm: float
    disease_signal: str
    detected_summary: str
    recommended_action: str
    source_state: str = "DEMO CHANGE ANALYSIS"
    timestamp: str

class InterventionOption(BaseModel):
    id: str
    title: str
    action_type: str
    description: str
    estimated_water_use: str
    risk_score: int
    resource_requirement: str
    relative_cost: str
    environmental_effect: str
    tradeoff_notes: str

class InterventionComparisonResponse(BaseModel):
    current_farm_state: Dict[str, Any]
    options: List[InterventionOption]
    disclaimer: str = "Scenario estimate — not measured field outcome. Tradeoffs presented transparently without declaring an automatic best choice."
    timestamp: str

class DataProvenanceItem(BaseModel):
    key: str
    title: str
    source: str
    provider: str
    processing: str
    collection: Optional[str] = None
    resolution: Optional[str] = None
    formula: Optional[str] = None
    observation_time: str
    roi_boundary: Optional[str] = None
    state: str

class SubsystemStatus(BaseModel):
    name: str
    status: str
    is_live: bool
    detail: str

class SystemStatusResponse(BaseModel):
    overall: str
    subsystems: Dict[str, SubsystemStatus]
    timestamp: str
