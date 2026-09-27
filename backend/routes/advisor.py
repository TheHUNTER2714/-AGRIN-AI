from fastapi import APIRouter
from backend.models.schemas import AdvisorRequest, AdvisorResponse
from backend.services.gemini import generate_gemini_agro_advisory

router = APIRouter(prefix="/api/advisor", tags=["Advisor"])

@router.post("", response_model=AdvisorResponse)
async def get_agro_advisory(req: AdvisorRequest):
    """
    Synthesizes farmer inquiry with unified multi-sensor farm context:
    live weather radar, Sentinel-2 NDVI/NDWI, ICAR soil parameters,
    and Crop Doctor pathology using Gemini.
    """
    location_str = req.location.farm_name if req.location else "Pratapgarh, Uttar Pradesh"
    soil_ctx = req.soil.model_dump() if req.soil else None
    weather_ctx = req.weather.model_dump() if req.weather else None
    satellite_ctx = req.satellite.model_dump() if req.satellite else None
    crop_doctor_ctx = req.crop_doctor.model_dump() if req.crop_doctor else None

    result = generate_gemini_agro_advisory(
        farmer_query=req.question,
        crop=req.crop,
        growth_stage=req.growth_stage,
        location=location_str,
        soil_context=soil_ctx,
        weather_context=weather_ctx,
        satellite_context=satellite_ctx,
        crop_doctor_context=crop_doctor_ctx,
        language=req.language
    )

    return AdvisorResponse(**result)
