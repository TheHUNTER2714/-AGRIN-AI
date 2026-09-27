from fastapi import APIRouter
from backend.models.schemas import SoilAnalysisRequest, SoilAnalysisResponse
from backend.services.soil import analyze_soil_health

router = APIRouter(prefix="/api/soil", tags=["Soil Health"])

@router.post("/analyze", response_model=SoilAnalysisResponse)
async def analyze_soil(req: SoilAnalysisRequest):
    """
    Evaluates in-situ soil test parameters (pH, N, P, K, Organic Carbon)
    against ICAR standards and returns regenerative nutrient adjustments.
    """
    result = analyze_soil_health(
        ph=req.ph,
        nitrogen=req.nitrogen,
        phosphorus=req.phosphorus,
        potassium=req.potassium,
        organic_carbon=req.organic_carbon,
        moisture=req.moisture or 28.0,
        crop=req.crop or "Wheat"
    )
    return SoilAnalysisResponse(**result)
