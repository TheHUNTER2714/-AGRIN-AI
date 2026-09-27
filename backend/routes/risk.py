from fastapi import APIRouter
from typing import Dict, Any, Optional
from pydantic import BaseModel
from backend.models.schemas import RiskEngineResponse
from backend.services.risk_engine import calculate_crop_risk

router = APIRouter(prefix="/api/risk", tags=["Risk Engine"])

class RiskCalculationRequest(BaseModel):
    weather: Optional[Dict[str, Any]] = None
    satellite: Optional[Dict[str, Any]] = None
    soil: Optional[Dict[str, Any]] = None
    disease_detected: bool = False
    crop_stage: str = "Vegetative Tillering"

@router.post("/calculate", response_model=RiskEngineResponse)
async def evaluate_risk(req: RiskCalculationRequest):
    """
    Central AI Risk Engine: Computes multi-sensor risk score (0-100),
    factor breakdown, explainability rationale, and early warnings.
    """
    result = calculate_crop_risk(
        weather_data=req.weather,
        satellite_data=req.satellite,
        soil_data=req.soil,
        disease_detected=req.disease_detected,
        crop_stage=req.crop_stage
    )
    return RiskEngineResponse(**result)

@router.get("/current", response_model=RiskEngineResponse)
async def get_current_risk():
    """
    Returns default real-time multi-sensor risk assessment for Demo Farm Plot A.
    """
    result = calculate_crop_risk(
        weather_data={"rain_probability": 82, "temperature_c": 28.0},
        satellite_data={"ndvi": 0.78},
        soil_data={"moisture": 28.0},
        disease_detected=False,
        crop_stage="Vegetative Tillering"
    )
    return RiskEngineResponse(**result)
