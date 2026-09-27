import io
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.models.schemas import CropDoctorResponse
from backend.services.gemini import analyze_crop_image_with_gemini
from backend.services.farm_context import FarmContextEngine

router = APIRouter(prefix="/api/crop_doctor", tags=["Crop Doctor"])

@router.post("/diagnose", response_model=CropDoctorResponse)
async def diagnose_crop_disease(
    image: UploadFile = File(...),
    crop_hint: str = Form("Wheat")
):
    """
    Multimodal plant pathology vision diagnostic powered by Gemini Vision.
    Identifies 12 structured fields: crop_name, leaf_name, health_status,
    disease_name, confidence, severity, symptoms, possible_causes,
    recommended_actions, prevention, image_quality, needs_expert_confirmation.
    """
    content_type = image.content_type or ""
    if not (content_type.startswith("image/") or image.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPEG, PNG, or WEBP image.")

    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Validate image bytes integrity
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupted or invalid image data. Please upload a valid image.")

    result = analyze_crop_image_with_gemini(
        image_bytes=image_bytes,
        crop_hint=crop_hint,
        mime_type=content_type or "image/jpeg"
    )

    return CropDoctorResponse(**result)

@router.get("/latest", response_model=Optional[CropDoctorResponse])
async def get_latest_crop_diagnosis():
    """
    Returns the latest Crop Doctor diagnosis registered in the active Farm Context.
    """
    latest = FarmContextEngine.get_instance().get_latest_diagnosis()
    if latest:
        return CropDoctorResponse(**latest)
    return None
