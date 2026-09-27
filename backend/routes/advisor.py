from fastapi import APIRouter
from backend.models.schemas import AdvisorRequest, AdvisorResponse
from backend.services.gemini import generate_gemini_agro_advisory

router = APIRouter(prefix="/api/advisor", tags=["Advisor"])

@router.post("", response_model=AdvisorResponse)
async def get_agro_advisory(req: AdvisorRequest):
    """
    Synthesizes farmer inquiry with real-time farm context, weather radar,
    satellite NDVI, and ICAR soil parameters using Gemini.
    """
    location_str = req.location.farm_name if req.location else "Pratapgarh, Uttar Pradesh"
    soil_ctx = req.soil.model_dump() if req.soil else None
    weather_ctx = req.weather.model_dump() if req.weather else None
    satellite_ctx = req.satellite.model_dump() if req.satellite else None

    result = generate_gemini_agro_advisory(
        farmer_query=req.question,
        crop=req.crop,
        growth_stage=req.growth_stage,
        location=location_str,
        soil_context=soil_ctx,
        weather_context=weather_ctx,
        satellite_context=satellite_ctx,
        language=req.language
    )

    return AdvisorResponse(**result)
