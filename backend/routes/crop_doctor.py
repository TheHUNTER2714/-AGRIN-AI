from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.models.schemas import CropDoctorResponse
from backend.services.gemini import analyze_crop_image_with_gemini

router = APIRouter(prefix="/api/crop_doctor", tags=["Crop Doctor"])

@router.post("/diagnose", response_model=CropDoctorResponse)
async def diagnose_crop_disease(
    image: UploadFile = File(...),
    crop_hint: str = Form("Wheat")
):
    """
    Multimodal plant pathology vision diagnostic powered by Gemini Vision.
    Identifies crop, pathogen/condition, severity, biological & chemical remedies.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPEG, PNG, or WEBP image.")

    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = analyze_crop_image_with_gemini(
        image_bytes=image_bytes,
        crop_hint=crop_hint,
        mime_type=image.content_type or "image/jpeg"
    )

    return CropDoctorResponse(**result)
