import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from backend.routes.advisor import router as advisor_router
from backend.routes.crop_doctor import router as crop_doctor_router
from backend.routes.weather import router as weather_router
from backend.routes.satellite import router as satellite_router
from backend.routes.soil import router as soil_router
from backend.routes.risk import router as risk_router
from backend.routes.voice import router as voice_router
from backend.routes.farms import router as farms_router
from backend.routes.context import router as context_router
from backend.services.satellite import get_earth_engine_status

app = FastAPI(
    title="AGRIN AI — Interoperable Agro-Intelligence API",
    description="Backend microservice for Sentinel-2 satellite analysis, Open-Meteo weather assimilation, Google Gemini agronomic reasoning, and AI Risk Engine.",
    version="1.0.0"
)

# CORS configuration
origins_env = os.getenv("CORS_ORIGINS", "")
if origins_env:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(advisor_router)
app.include_router(crop_doctor_router)
app.include_router(weather_router)
app.include_router(satellite_router)
app.include_router(soil_router)
app.include_router(risk_router)
app.include_router(voice_router)
app.include_router(farms_router)
app.include_router(context_router)

@app.get("/api/health")
async def health_check():
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))
    ee_status = get_earth_engine_status()
    return {
        "status": "healthy",
        "service": "AGRIN AI Backend Engine",
        "gemini_active": gemini_key_present,
        "mode": "live_gemini" if gemini_key_present else "demo_fallback_active",
        "earth_engine": ee_status,
        "satellite_pipeline": "operational",
        "timestamp": "Operational"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
