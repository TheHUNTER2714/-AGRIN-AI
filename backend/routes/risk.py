from fastapi import APIRouter
from typing import Dict, Any, Optional
from pydantic import BaseModel
from backend.models.schemas import RiskEngineResponse
from backend.services.risk_engine import calculate_crop_risk

router = APIRouter(prefix="/api/risk", tags=["Risk Engine"])

class RiskCalculationRequest(BaseModel):
    context: Optional[Dict[str, Any]] = None
    weather: Optional[Dict[str, Any]] = None
    satellite: Optional[Dict[str, Any]] = None
    soil: Optional[Dict[str, Any]] = None
    crop_doctor: Optional[Dict[str, Any]] = None
    disease_detected: bool = False
    crop_stage: Optional[str] = None

@router.post("/calculate", response_model=RiskEngineResponse)
async def evaluate_risk(req: RiskCalculationRequest):
    """
    Central AI Risk Engine: Computes multi-sensor risk score (0-100),
    factor breakdown, early warnings, and factor-level explanations
    (weather, vegetation, water/soil, disease) computed from context.
    """
    result = calculate_crop_risk(
        context=req.context,
        weather_data=req.weather,
        satellite_data=req.satellite,
        soil_data=req.soil,
        crop_doctor_data=req.crop_doctor,
        disease_detected=req.disease_detected,
        crop_stage=req.crop_stage
    )
    return RiskEngineResponse(**result)

@router.get("/current", response_model=RiskEngineResponse)
async def get_current_risk():
    """
    Returns real-time multi-sensor risk assessment calculated directly from
    the current unified Farm Context (no hardcoded inputs).
    """
    result = calculate_crop_risk()
    return RiskEngineResponse(**result)
