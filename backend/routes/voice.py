from fastapi import APIRouter
from backend.models.schemas import VoiceQueryRequest, VoiceQueryResponse
from backend.services.gemini import process_vernacular_voice_query

router = APIRouter(prefix="/api/voice", tags=["Voice Assistant"])

@router.post("/query", response_model=VoiceQueryResponse)
async def handle_voice_query(req: VoiceQueryRequest):
    """
    Translates vernacular spoken queries into agronomic context and generates
    concise, spoken conversational guidance in Hindi or regional languages via Gemini.
    """
    result = process_vernacular_voice_query(
        transcript=req.transcript,
        language=req.language or "hi",
        crop=req.crop or "Wheat"
    )
    return VoiceQueryResponse(**result)
