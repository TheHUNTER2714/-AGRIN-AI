# 🌱 AgriN AI — From Satellite to Soil

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Submission--Ready-00E599?style=for-the-badge&logo=target)](https://github.com/TheHUNTER2714/-AGRIN-AI)
[![Live Prototype](https://img.shields.io/badge/Live_Prototype-SnapDeploy-0ea5e9?style=for-the-badge&logo=docker)](https://hit-958b1.containers.snapdeploy.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Copernicus Sentinel-2](https://img.shields.io/badge/Sentinel--2-10m_MSI-blue?style=for-the-badge)](https://sentinels.copernicus.eu/)

> **AgriN AI** is an AI-powered agricultural intelligence platform that combines Sentinel-2 satellite observations, Open-Meteo weather intelligence, soil chemistry profiles, crop-image diagnostics, unified farm context, and explainable AI to help Indian farmers make climate-resilient and regenerative farming decisions.

---

### 🌐 Live Prototype & Source Code
* **Live Deployment (SnapDeploy Cloud Containers)**: [https://hit-958b1.containers.snapdeploy.app/](https://hit-958b1.containers.snapdeploy.app/)
* **GitHub Repository**: [https://github.com/TheHUNTER2714/-AGRIN-AI](https://github.com/TheHUNTER2714/-AGRIN-AI)
* **Current Active Branch**: `main-2`
* **Hackathon Track**: AgriN & Regenerative Agricultural Intelligence
* **BRICS Theme**: Cooperation & Open Agricultural AI Interoperability

---

## 🌾 1. Problem & Challenge

India is home to **140+ million smallholder farmers** cultivating over 86% of the nation's operational agricultural landholdings. Despite their critical contribution to global food security, these farmers face compounding risks:

1. **Extreme Climate Volatility**: Unpredictable monsoon onset, unseasonal rainfall, and severe heatwaves trigger untimely irrigation, fertilizer runoff, and severe yield loss.
2. **Fragmented & Delayed Advisory**: Traditional public extension systems cannot deliver timely parcel-specific guidance for millions of dispersed farms.
3. **Black-Box AI & Mistrust**: Most generic AI apps present unexplained advice and opaque recommendations without showing data origins or scientific formulas.
4. **Soil Degradation & Crop Stubble Burning**: Decades of intensive monoculture and lack of circular incentives have depleted soil organic carbon and exacerbated North India's seasonal stubble pollution.
5. **Cross-Border Climate Fragility**: Agricultural challenges transcend borders. Global South nations (BRICS) face shared climate threats but lack standardized, privacy-preserving frameworks to share agricultural models without surrendering national data sovereignty.

---

## 🎯 2. Solution: From Satellite to Soil

**AgriN AI** closes the loop between orbital observation and ground action through a unified, 11-stage agricultural intelligence pipeline:

```
                          🧑‍🌾 FARMER
                              │
                    ┌─────────┴─────────┐
                    │                   │
             📍 FARM REGISTRATION   📷 CROP LEAF
                    │                   │
             GEOJSON BOUNDARY     GEMINI VISION
                    │             (12 Diagnostics)
                    ↓                   │
             🛰️ SENTINEL-2 MSI          │
             (10m Level-2A SR)          │
                    │                   │
             NDVI / NDWI Trend          │
                    │                   │
             🌦️ OPEN-METEO WEATHER      │
             (Precip, Temp, Wind)       │
                    │                   │
             🌱 SOIL CHEMISTRY          │
             (ICAR Nutrients & pH)      │
                    │                   │
                    └─────────┬─────────┘
                              ↓
                  🧠 UNIFIED FARM CONTEXT
                  (Thread-Safe Multi-Sensor State)
                              ↓
                  ⚡ RISK ENGINE (Deterministic)
                  (Weather 30% + Veg 25% + Soil 25% + Disease 20%)
                              ↓
                  🔍 EXPLAINABLE AI ("WHY?")
                  (Math Disclosed + Gemini Contextual Rationale)
                              ↓
                  ✨ ACTIONABLE ADVISORY
                  (Regenerative Protocols & Irrigation Guidance)
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
         🗣️ AGRIVANI     🧑‍🌾 SIMPLE MODE   🧪 DIGITAL TWIN
         (Hindi Voice)   (Vernacular)    (Scenario Stress)
              │               │               │
              └───────────────┼───────────────┘
                              ↓
                  ♻️ REGENERATIVE CROP ROTATION
                  & CIRCULAR RESIDUE MARKETPLACE
                              ↓
                  🏢 FPO / DISTRICT DPI AGGREGATION
                  (Anonymous Disease Early Warning)
                              ↓
                  🌍 BRICS MODEL EXCHANGE
                  (Sovereign Local Data + Shared Schema v1)
```

---

## 🔬 3. Real vs. Demo/Simulation Implementation Matrix

To preserve complete scientific integrity, technical credibility, and full transparency for judges, AgriN AI strictly distinguishes live external pipelines from calibrated simulations:

| Capability / Module | Operational Status | Data Source / Engine | Provenance & Handling |
|---|---|---|---|
| **Google Gemini Reasoning** | **Live** (when API configured) | Google Gemini 2.5 Flash / 1.5 Flash | Centralized configuration in `backend/services/gemini.py` with multi-model fallback chain. Returns prompt and model metadata. |
| **Crop Doctor Vision** | **Live** (when Gemini configured) | Multimodal Gemini Vision | 12 structured pathology fields; Pillow image verification. Calibrated ICAR benchmark fallback when unkeyed. |
| **Sentinel-2 Satellite** | **Live** (when GEE configured) | Copernicus Sentinel-2 MSI (10m) | Google Earth Engine `COPERNICUS/S2_SR_HARMONIZED`. Dedicated per-pass band arithmetic for historical time-series. Benchmark fallback when unkeyed. |
| **Weather Intelligence** | **Live** | Open-Meteo Global Forecast API | Real-time downscaled Numerical Weather Prediction (ECMWF/GFS). Transparently branded Open-Meteo (no false Doppler claims). |
| **AgriN Risk Engine** | **Calculated** | AgriN Deterministic Risk Engine v2.4 | Mathematical formulation (`Composite = 0.30*Wx + 0.25*Veg + 0.25*Soil + 0.20*Pathology`). Math is separated from LLM generation. |
| **AI Decision Trace ("WHY?")**| **Calculated + Explained** | Farm Context + Risk Math + Gemini | 3-tier explainability: Farm State ➔ Deterministic Math Breakdown ➔ Gemini Plain-Language Rationale with uncertainty factors. |
| **Farm Change Detection** | **Calculated / Demo** | Multi-temporal Context Diff | Detects deltas in NDVI, NDWI, soil moisture, and pathology flags between observation windows. |
| **AgriVani Voice Assistant** | **Live** (Grounded) | Web Speech API + Gemini AI | Natural language queries in Hindi/English grounded directly in the active farm context envelope. |
| **Digital Twin Simulator** | **Simulation** | Multi-parameter Stress Perturbation | Scenario simulator (+-30% rain, +-20% irrigation, +2°C temp). Explicitly labeled: *Scenario Simulation — Not a Scientific Yield Forecast*. |
| **Intervention Simulator** | **Simulation** | Tradeoff Comparative Engine | Evaluates 3 discrete management options (Irrigate Today vs. Delay 48h vs. Delay + Drainage) with resource and cost tradeoffs. |
| **Regenerative Score** | **Calculated** | 5-Dimension AgriN Matrix | Transparent weighted sum (Water 20 + Nutrient 20 + Residue 20 + Carbon 20 + Diversity 20) with visible formulas. |
| **Crop Rotation Planner** | **Advisory Model** | ICAR Agronomic Rotation Cycles | 4-season sequence (Wheat ➔ Pulse ➔ Mustard ➔ Wheat) with ecological trade-offs. |
| **AgriCycle Circular Economy** | **Prototype / Estimate** | Circular Supply Chain Workflow | Aggregation logistics, pyrolysis biochar valorization, and estimated DBT farmer payouts. |
| **FPO District Network** | **Prototype Public Infrastructure** | Spatial Cluster Anomaly Aggregator | 4-tier alert propagation (Farm ➔ Village ➔ FPO ➔ District) with strict DPDP anonymization. |
| **India Command Center** | **Prototype Regional Dataset** | Macro-to-Micro Geospatial Hierarchy | Multi-layer choropleths (Vegetation, Water Stress, Disease Anomaly) across State ➔ District ➔ Block ➔ Farm. |
| **BRICS Model Exchange** | **Prototype / Architecture Demo** | AgriN Interoperability Schema v1.0 | Demonstrates federated cross-border model weight sharing while keeping raw farmer data sovereign and local. |
| **National Impact Metrics** | **Projected / Simulation** | Empirical Pilot Benchmarks | All macro metrics (12,482 farms, 1,248 tonnes stubble) are labeled as *Projected / Pilot Benchmark*. |

---

## 🏛️ 4. Technical Architecture

### Frontend Architecture
* **Framework**: React 19 + TypeScript 5.9 + Vite 8.3
* **Styling**: Tailored Dark Climate-Tech Design System (HSL emerald, warm cream `#ECE8DD`, deep forest `#030B07`, glassmorphism, subtle organic noise)
* **Visualizations & Motion**: Three.js ambient canvas, HTML5 Canvas 2.5D isometric plot rendering, Framer Motion transitions
* **Audio & Vernacular TTS**: Browser Native Web SpeechSynthesis API + Web Audio Synthesizer sound effects
* **Accessibility**: Dedicated bilingual **Farmer Simple Mode** (Hindi / English) with high-contrast cards and non-technical status indicators (🌱 *फसल की हालत: अच्छी*)
* **Resilience**: PWA ServiceWorker offline caching simulation for intermittent rural 2G connectivity

### Backend Architecture
* **Framework**: FastAPI (Python 3.10+ / 3.11 / 3.14 compatible)
* **AI & Multimodal**: Google Gemini API via official SDK with centralized model configuration (`GEMINI_MODEL=gemini-2.5-flash`), temperature control, and structured JSON parsing
* **Earth Engine Integration**: `earthengine-api` with server-side authentication (`EARTH_ENGINE_SERVICE_ACCOUNT` / `EARTH_ENGINE_PROJECT`). Historical time-series bug fixed to calculate independent `f_ndvi_img` and `f_ndwi_img` per pass
* **Weather Integration**: Open-Meteo REST API downscaling ECMWF global models to 1km resolution
* **Image Processing**: Pillow (PIL) for image validation, MIME verification, and thumbnail generation
* **Security**: Zero API keys exposed on client; strict CORS policy; request body validation via Pydantic v2 schemas; DPDP Act 2023 farmer consent center

---

## 🌟 5. Key Innovations & Critical Technical Upgrades

### 1. Fixed Sentinel-2 Historical Time Series
* In `backend/services/satellite.py`, resolved the bug where the historical pass loop was inadvertently referencing the latest NDVI image.
* Now, every historical image computes its own discrete band arithmetic:
  ```python
  f_ndvi_img = f_img.normalizedDifference(["B8", "B4"]).rename("ndvi")
  f_ndwi_img = f_img.normalizedDifference(["B8", "B11"]).rename("ndwi")
  ```
* Yields genuine historical acquisition dates, NDVI, NDWI, cloud cover percentages, and trajectory trends.

### 2. Transparent Source Provenance Badging
* Zero synthetic values are disguised as live telemetry.
* System-wide badge states:
  * `LIVE • SENTINEL-2` (GEE authenticated)
  * `LIVE • OPEN-METEO` (Live weather)
  * `CALCULATED • AGRIN ENGINE` (Deterministic math)
  * `DEMO • BENCHMARK` (Copernicus calibrated baseline)
  * `SIMULATION • DIGITAL TWIN` (What-if stress testing)
* Interactive **Data Provenance Modal** allows judges and agronomists to audit the exact collection, provider, resolution, formula, and observation timestamp for every metric.

### 3. Explainable AI Decision Trace ("WHY DID AGRIN RECOMMEND THIS?")
* Eliminates the black-box problem by providing a 3-tier breakdown:
  1. **Observed Farm State**: Crop stage (Tillering), Soil moisture (28%), Rain probability (72%), NDVI (0.76), Pathology (Low).
  2. **Deterministic Risk Math**: Weather (22/30) + Vegetation (8/25) + Soil (14/25) + Pathology (3/20) = 47/100 Composite Risk.
  3. **Gemini Rationale**: Actionable human-understandable guidance ("Hold irrigation for 24–36 hours to avoid waterlogging").
  4. **Uncertainty Factors**: Discloses specific triggers that would alter the advisory (rainfall shifts, new satellite passes, growth stage updates).

### 4. Multimodal Gemini Crop Doctor with Conservative Agronomic Framing
* Purged all fabricated "ViT 96.2%" claims across code, comments, and UI. Accurately branded as **Multimodal Gemini Vision Crop Diagnostic**.
* Delivers 12 structured pathology parameters.
* Features prominent safety banners: `PRELIMINARY AI DIAGNOSIS` and `VERIFY HIGH-RISK TREATMENT WITH LOCAL AGRONOMIST / KVK`.

### 5. Grounded Vernacular Voice Assistant (AgriVani)
* Voice queries (e.g. *"क्या आज मेरे खेत में पानी देना चाहिए?"*) are dynamically resolved against the live `FarmContext` (weather, soil moisture, satellite NDVI, crop stage).
* Zero hardcoded canned responses; Gemini generates conversational, context-grounded Hindi and English answers.

### 6. Digital Twin Scenario Stress & Intervention Simulator
* Sliders for climate shock (+-30% rainfall, +-20% irrigation, +2°C temperature, +10% nitrogen).
* Displays explicit scientific disclaimer: `SCENARIO SIMULATION — NOT A SCIENTIFIC YIELD FORECAST`.
* Embedded **Intervention Simulator** compares Option A (Irrigate Today), Option B (Delay 48h), and Option C (Delay + Drainage) with transparent resource and cost tradeoffs.

### 7. 5-Dimension Regenerative Score & Crop Rotation Planner
* Mathematical formulation across 5 pillars (Water Stewardship, Nutrient Efficiency, Residue Management, Soil Carbon, Crop Diversity).
* 4-season crop rotation model: Wheat ➔ Pulse (Moong/Gram) ➔ Mustard ➔ Wheat, highlighting nitrogen fixation and water savings.

### 8. India Command Center & DPI Alert Network
* Multi-scale hierarchy: India ➔ State ➔ District ➔ Block ➔ Village ➔ Farm parcel.
* 4-stage disease escalation (Farm detection ➔ 8 neighboring farm signals ➔ FPO cluster warning ➔ District agricultural alert).
* Masked with `ANONYMOUS AGGREGATE` to protect farmer privacy under India's Digital Personal Data Protection (DPDP) Act 2023.

### 9. BRICS Interoperability Schema v1.0
* Demonstrates cross-border federated learning architecture for agricultural AI.
* Raw farm data remains strictly local within national boundaries.
* Shares only differential model updates, climate anomaly vectors, and disease signatures via an interactive JSON Model Package exporter.

---

## ⚡ 6. How to Run Locally

### Prerequisites
* **Node.js**: v18.0+ (tested on Node v20/v22)
* **Python**: v3.10+ (tested on Python 3.11/3.14)
* **Google Gemini API Key**: Free tier from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/TheHUNTER2714/-AGRIN-AI.git
cd -AGRIN-AI
git checkout main-2
```

### 2. Backend Setup & Test Verification
```bash
# 1. Install Python dependencies
py -m pip install -r backend/requirements.txt

# 2. Configure environment variables
# Copy .env.example to backend/.env and populate your keys:
# GEMINI_API_KEY=your_key_here
# GEMINI_MODEL=gemini-2.5-flash

# 3. Run the comprehensive 17-point automated pipeline test suite
py -m backend.test_pipeline

# 4. Start the FastAPI backend server
py -m uvicorn backend.main:app --reload --port 8000
```
Backend runs at `http://127.0.0.1:8000` (Interactive OpenAPI Swagger documentation at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup & Build
In a second terminal window:
```bash
# 1. Install frontend dependencies
npm install

# 2. Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`. Vite automatically proxies `/api` requests to the FastAPI backend.

### 4. Build Production Bundle
```bash
npm run build
```
Compiles TypeScript with 0 errors and generates the production bundle in `dist/`.

---

## ☁️ 7. Deployment Configuration (SnapDeploy)

AgriN AI is deployed as a containerized web service on **SnapDeploy**:
* **Live Deployment URL**: [https://hit-958b1.containers.snapdeploy.app/](https://hit-958b1.containers.snapdeploy.app/)
* **Container Architecture**: Multi-stage Linux container serving the FastAPI Python core and bundled React static assets.
* **Environment Variables configured in SnapDeploy**:
  * `GEMINI_API_KEY`: Google AI Studio production API key
  * `GEMINI_MODEL`: `gemini-2.5-flash`
  * `CORS_ORIGINS`: `*`
  * `PORT`: `8000`

---

## 🔑 8. Environment Variables Reference

Create `backend/.env` (reference: `backend/.env.example`):

| Variable | Required? | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Recommended | `""` (runs demo fallback) | Google AI Studio API Key for Gemini reasoning and Crop Doctor vision. |
| `GEMINI_MODEL` | Optional | `gemini-2.5-flash` | Primary Gemini model ID. Fallbacks: `gemini-1.5-flash`, `gemini-flash-latest`. |
| `EARTH_ENGINE_PROJECT` | Optional | `""` (runs demo benchmark) | Google Cloud Project ID with Earth Engine API enabled. |
| `EARTH_ENGINE_SERVICE_ACCOUNT`| Optional | `""` | GEE Service Account email address. |
| `EARTH_ENGINE_PRIVATE_KEY` | Optional | `""` | Service account JSON private key for headless cloud server environments. |
| `CORS_ORIGINS` | Optional | `http://localhost:5173,http://127.0.0.1:5173` | Allowed CORS origins for FastAPI. |

---

## 📡 9. Core Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Subsystem health probe (Gemini, Earth Engine, weather, mode). |
| `GET` | `/api/context` | Returns active multi-sensor unified `FarmContext`. |
| `GET` | `/api/context/change` | Returns differential "What Changed Since Last Check?" telemetry. |
| `GET` | `/api/context/provenance` | Returns auditable data provenance and sensor attribution registry. |
| `GET` | `/api/context/interventions` | Returns comparative trade-offs for 3 agricultural interventions. |
| `GET` | `/api/context/status` | Real-time status inspector for 8 AgriN AI subsystems. |
| `GET` | `/api/weather` | Open-Meteo downscaled weather intelligence for farm coordinates. |
| `GET` | `/api/satellite` | Sentinel-2 multispectral NDVI/NDWI and directional vigor trend. |
| `POST` | `/api/satellite` | Spatial polygon zonal stats calculation from Sentinel-2 surface reflectance. |
| `POST` | `/api/crop-doctor/diagnose` | Multipart leaf image upload ➔ Gemini Vision 12-field pathology. |
| `GET` | `/api/risk/current` | Context-derived 4-factor deterministic crop health and risk calculation. |
| `POST` | `/api/advisor` | Gemini agricultural advisory grounded in live farm context. |
| `POST` | `/api/voice/query` | Vernacular voice reasoning in Hindi/English grounded in farm context. |
| `POST` | `/api/farms/demo/reset` | One-click deterministic reset to canonical Pratapgarh, UP demo farm. |

---

## 🎬 10. Recommended 4-Minute Interactive Platform Walkthrough

Users and agronomists can open the **`⋮ Options`** (3-dot) menu in the top navigation bar at any point to access live Subsystem Status, Data Provenance, Farmer Consent, Ecosystem Impact, and Simple Farmer Mode, or follow this 10-step sequence:

1. **0:00 – 0:20 (Entry & One-Click Demo Reset)**: Click **`DEMO FARM`** in the navigation bar. Instant initialization of the 14.2 ha Pratapgarh, UP Sharbati Wheat demo parcel.
2. **0:20 – 0:45 (Live Weather Intelligence)**: Navigate to **Weather**. Point out transparent **Open-Meteo** branding, rain probability (72%), and agro-advisories.
3. **0:45 – 1:15 (Sentinel-2 Satellite)**: Navigate to **Satellite**. Toggle between Real Satellite RGB and NDVI canopy vigor. Point out the fixed historical time-series computing unique NDVI/NDWI per pass.
4. **1:15 – 1:40 (Deterministic Risk & AI Decision Trace)**: In **Command Center**, click **"Why 47?"**. Show the 3-step decision trace isolating the deterministic risk math from the Gemini reasoning. Click **Inspect Data Provenance** to view the collection and formula.
5. **1:40 – 2:15 (Crop Doctor Vision)**: Navigate to **Crop Doctor**. Upload a leaf photo. Observe the 12-field structured diagnosis, preliminary AI safety warning, and agronomist verification badge.
6. **2:15 – 2:40 (Grounded Voice & Simple Mode)**: Switch to **Simple Mode** (🧑‍🌾) to show the bilingual Hindi/English interface. Click the mic or voice query to hear context-grounded reasoning (*"सिंचाई 24-36 घंटे टालें"*).
7. **2:40 – 3:10 (Digital Twin & Intervention Simulator)**: Navigate to **Digital Twin**. Adjust the rainfall lever to `-30%`. Note the non-yield forecast disclaimer and explore the 3-option Intervention Tradeoff Simulator.
8. **3:10 – 3:35 (Regenerative Agriculture)**: Navigate to **Regenerative**. Inspect the 5-dimension AgriN Regenerative Score formula and explore the 4-phase crop rotation planner.
9. **3:35 – 3:55 (India Command & FPO Cluster DPI)**: Navigate to **India Map**. Review the 4-tier alert network propagating from an anonymous farm to village to district warning.
10. **3:55 – 4:10 (BRICS Interoperability)**: Navigate to **BRICS**. Click **Generate Model Package** to view the standardized AgriN Interoperability Schema v1.0.

---

## 🛡️ 11. Privacy, Trust & AI Safety

* **India DPDP Act 2023 Compliance**: Granular farmer consent toggles in the **AgriN Trust Center** (GPS location, soil telemetry, satellite analysis, audio logs). Zero unauthorized third-party sharing.
* **Data Minimization**: Regional and FPO aggregation anonymizes farm and farmer identities upstream (`ANONYMOUS AGGREGATE`).
* **Medical / Agronomic Safety Guardrails**:
  * AI disease diagnosis is explicitly marked as a **Preliminary AI Diagnosis**.
  * Chemical treatment prescriptions mandate: *"Verify approved product, crop stage, local label instructions, and KVK / agricultural officer guidance before application."*
  * Digital Twin outputs are strictly framed as **Scenario Simulations**, never guaranteed scientific yield forecasts.

---

## 🔮 12. Limitations & Future Roadmap

### Current Prototype Limitations
1. **Google Earth Engine Cloud Quota**: Requires active GCP project credentials for live imagery; falls back to calibrated Copernicus benchmark data when unkeyed.
2. **Offline Mode**: Demonstrates ServiceWorker offline caching; deep offline model inference requires quantized on-device WebAssembly/TensorFlow.js models.
3. **Soil Telemetry**: Relies on farmer-input Soil Health Card reports and benchmark assays; requires integration with IoT soil probes for real-time continuous moisture telemetry.

### Future Roadmap
* **Phase 1 (Post-Hackathon)**: Pilot deployment across 50 Farmer Producer Organizations (FPOs) in Uttar Pradesh and Punjab in partnership with State Agricultural Universities.
* **Phase 2 (National DPI Scale)**: Integration with the Government of India's **AgriStack** (Unified Farmer ID & Digital Crop Survey).
* **Phase 3 (BRICS Expansion)**: Piloting the open-source AgriN Interoperability Schema with research partners at EMBRAPA (Brazil) and the Agricultural Research Council (South Africa).

---

© 2026 **AgriN AI** — *From Satellite to Soil.* Engineered for India's farmers; architected for global cooperative agricultural intelligence.
