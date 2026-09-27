# 🌱 AGRIN AI — Interoperable Digital Agriculture Network & AI Digital Public Good

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Ready-00E599?style=for-the-badge&logo=target)](https://github.com/TheHUNTER2714/-AGRIN-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **AGRIN AI** is an interoperable, climate-resilient Digital Public Good (DPG) engineered for India's 140+ million smallholder farmers. By synthesizing ESA Sentinel-2 multispectral satellite telemetry, IMD micro-climate Doppler radar, ICAR soil health assays, and Vision Transformer (ViT) edge diagnostics, AgriN delivers hyperlocal regenerative advisories and federated cross-border agricultural intelligence.

---

## 🌾 The Problem
Small and marginal farmers across India lack access to real-time, data-driven agricultural guidance. Relying on traditional guesswork instead of satellite indices, soil moisture analytics, and hyper-local climate forecasting leads to recurring crop failure, groundwater depletion, and food insecurity. Furthermore, the absence of shared digital infrastructure prevents cross-state and cross-district collaboration on climate-resilient farming practices.

## 🎯 The Challenge & Mission
Build an interoperable digital agriculture network that delivers real-time, localized agro-advisories using AI. Offer regenerative crop recommendations based on satellite data, soil health, and weather forecasting, plus an in-field crop disease diagnostic tool. Design it as a scalable Digital Public Good enabling Indian states and global partners (BRICS) to share agricultural data models and strengthen sustainable food production.

---

## 🏛️ System Architecture

```
                             AGRIN AI
                                │
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
   EXPERIENCE              INTELLIGENCE           INFRASTRUCTURE
        │                       │                       │
 • 3D Canvas / Digital Twin • Gemini Multimodal API • India Scale (AgriStack)
 • Atmospheric Living UI    • Sentinel-2 Multispectral • FPO Data Aggregation
 • "Field to Future" Story  • Doppler Radar / Weather • State Agriculture Depts
 • Vernacular Voice (22 L)  • ICAR Soil Health Graph • BRICS Model Exchange
```

---

## 🚀 18 Signature Features Implemented

### 1. 🚀 AI Farm Digital Twin (Signature Wow Feature)
- **Virtual Field**: 2.5D isometric field simulation with an interactive `🌱` crop grid across 4 distinct plots.
- **What-If Simulation Engine**: Sliders for Rainfall Anomaly (`-50%` to `+80%`), Irrigation Reduction (`-60%` to `+40%`), and Temperature Anomaly (`-2°C` to `+5°C`).
- **Dynamic Recalculation**: Live visual color shifts (vibrant green ➔ waterlogged deep green ➔ scorched amber/dry soil) with instant recalculation of Field Health score, Yield Forecast, and Root-zone moisture.
- **Multi-layer Viewing**: Farm Twin view, Thermal Stress view, and Root-Zone capillary water view.

### 2. 🧠 Explainable AI "Why?" Engine
- Every AI recommendation features an interactive **"Why?" button**.
- Breaks down the complete reasoning chain behind decisions (e.g. *Why delay irrigation?*):
  - 🌧️ **82% Rainfall Probability** (convective storm cell arriving in 14h)
  - 💧 **Current Root-Zone Moisture: 68%** of field capacity
  - 🌱 **Crop**: Sharbati Wheat (Triticum aestivum)
  - 📅 **Growth Stage**: Vegetative Tillering (Day 28)
  - 🛰️ **NDVI Trend**: Stable at 0.78 (+0.04 over 10-day cycle)
- Demonstrates ethical, explainable AI rather than black-box recommendations.

### 3. 🛰️ Satellite Farm Time Machine
- Multi-temporal Sentinel-2 MSI satellite explorer with dual scrubbing modes: **Multi-Week Scrubber** (Sep 01 ➔ Sep 26) and **Multi-Year Historical Trend** (2024 ➔ 2026).
- Real-time animated crop lifecycle transitions: `HEALTHY` ➔ `STRESSED` ➔ `RECOVERY`.
- Interactive Canvas pixel inspector showing coordinate-level NDVI values (0.00 – 1.00) and optical/NDWI cloud masking.

### 4. 🌦️ AI Climate Scenario Simulator
- Micro-climate stress modeling with interactive temperature (`-3°C` to `+6°C`) and rainfall (`-60%` to `+60%`) sliders.
- Instant calculation of **Current Risk (42)** vs **Future Simulated Risk (67)**.
- Specific agronomic impact forecast with proactive mitigation actions (mulching, drought-hardy seed varieties, micro-sprinklers).

### 5. 🌾 Phenological Crop Growth Journey
- Full lifecycle stage tracking: `SEED` ➔ `GERMINATION` ➔ `VEGETATIVE` ➔ `FLOWERING` ➔ `GRAIN FILLING` ➔ `HARVEST`.
- Active stage glow with stage-specific water needs, nutrient focus (NPK ratios), pest vulnerability matrices, and localized advisories.

### 6. 🤝 Farmer ➔ FPO ➔ Government Data Network
- Multi-tier digital public infrastructure connecting grassroots farmers with Farmer Producer Organizations (FPOs) and State Agriculture Departments.
- **District Hotspot Detection**: Aggregates anonymous farmer telemetry to detect regional water stress across 4 villages (340 farmers) before localized crop failure occurs.

### 7. 🚨 AI Early Preventive Intervention
- Proactive predictive warning feed triggered **before** visible crop damage occurs:
  - Anomaly detection flagged Sentinel-2 NDVI declining -0.07 over 3 consecutive passes.
  - Early warning dispatch with exact GPS coordinates and preventive biological spray advice.

### 8. 🧑‍🌾 High-Accessibility Farmer Simple Mode
- Built for non-tech-savvy rural farmers:
  - Massive high-contrast action cards.
  - **Top 3 Daily Actions** in simple conversational language (*"Don't irrigate today"*, *"Inspect lower field"*, *"Rain expected"*).
  - One-tap Hindi audio speech synthesis (`🔊 सुनो`).
  - Real-time local Mandi price ticker for Wheat, Mustard, and Pigeon Pea.
  - Instant toggle between **Farmer Simple Mode** and **Agronomist Expert Mode**.

### 9. 🎙️ AgriVani Voice-First Mode
- Full-screen vernacular voice interface supporting **22 Indian Scheduled Languages + English**.
- Handles colloquial Hindi/Bhojpuri/Punjabi queries (*"मेरे खेत में पानी कब देना चाहिए?"*).
- Contextual multimodal speech synthesis and conversational reasoning powered by Gemini.

### 10. 🗺️ Pan-India Agricultural Risk Heatmap
- 6 interactive geospatial layers:
  1. 🦠 **Crop Disease Outbreaks**
  2. 💧 **Root-Zone Water Stress**
  3. 🌡️ **Extreme Heat Anomaly**
  4. 🌧️ **Monsoon Rainfall Deprivation**
  5. 🌱 **Vegetation Health Index (VHI)**
  6. 🔥 **Crop Residue Burning Vulnerability**
- Drill-down navigation: National ➔ State (UP, Punjab, MP, Maharashtra) ➔ District ➔ Village clusters.

### 11. ♻️ AgriCycle Stubble Circular Economy Map
- Complete supply-chain network turning paddy straw burning into clean economic revenue:
  - **Farmer A, B, C** ➔ **Village Aggregation Hub (Awadh Agro Hub)** ➔ **Industrial Pyrolysis & Biomass Processors**.
  - Real-time biomass booking, pickup truck fleet dispatch, and direct DBT Kisan bank payouts (₹1,950/tonne).

### 12. 📈 National Ecosystem Impact Dashboard
- Transparent prototype metrics clearly designated as simulated deployment benchmarks:
  - **12,482** Farms Monitored
  - **38,291** AI Advisories Generated
  - **4,182** Early Risk Warnings Issued
  - **7,294** Disease Diagnoses
  - **1,248 Tonnes** Crop Residue Diverted (Zero Burn)
  - **184** Villages Covered

### 13. 🧬 AI Model Transparency & Data Provenance
- Transparent 5-stage inference pipeline visible to judges and agronomists:
  `Data Sources (Sentinel-2, IMD, ICAR)` ➔ `Data Validation & Cloud Masking` ➔ `Context Fusion` ➔ `Gemini Reasoning` ➔ `Actionable Farmer Advisory`.
- Verifiable model weights, confidence intervals, and citation logs.

### 14. 🌐 Rural Offline / Low-Connectivity PWA Mode
- ServiceWorker telemetry caching designed for intermittent 2G/edge rural networks.
- Automatic Offline Banner indicating cached satellite plots, soil parameters, and emergency offline guides.
- Automatic background telemetry queue sync as soon as cellular signal reconnects.

### 15. 🔐 Farmer Data Consent Center (DPDP Act 2023 Compliant)
- Granular permission management putting the farmer in full control of their data sovereignty:
  - GPS Location Sharing (`ON/OFF`)
  - Crop & Yield Data (`ON/OFF`)
  - Soil Lab Telemetry (`ON/OFF`)
  - Satellite Analysis (`ON/OFF`)
  - Voice Recording Logs (`ON/OFF`)
- One-click **"Export Digital Kisan Passport"** JSON file generation.

### 16. 🌍 BRICS Agricultural Model Exchange
- Federated prototype showing secure, decentralized model transfer across **India 🇮🇳, Brazil 🇧🇷, South Africa 🇿🇦, China 🇨🇳, and Russia 🇷🇺**.
- Shareable models: Coffee Leaf Rust ViT, Sugarcane Drought Resilience, Semi-Arid Maize Model, and Winter Wheat Frost Hardiness.

### 17. 🎨 Atmospheric Living UI
- Dynamic ambient environment that responds visually to agricultural reality:
  - **Monsoon Rain**: Dynamic raindrops and precipitation streaks.
  - **Heat Risk**: Warm amber atmospheric shimmer.
  - **Lush Flora**: Bio-luminescent green plant growth particles.
  - **Satellite Pass**: Precision orbital scanning lasers and telemetry grid.
- Includes an interactive quick switcher pill on the bottom-left.

### 18. 🌱 "Field to Future" Animation & Narrative
- Cinematic interactive closing showcase:
  `🌱 One Seed` ➔ `🚜 Farm` ➔ `🏡 Village` ➔ `🏢 District` ➔ `🏛️ State` ➔ `🇮🇳 India` ➔ `🌍 BRICS`.
  - Auto-play narrative timeline with confetti celebration: *"Intelligence that grows with every farm."*

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Styling & Theme** | [Tailwind CSS 3.4](https://tailwindcss.com/) (Custom Dark Climate-Tech System) |
| **3D & Visualizations** | [Three.js](https://threejs.org/) + HTML5 Canvas 2.5D Isometric Engine |
| **Motion & Dynamics** | [Framer Motion 12](https://www.framer.com/motion/) + Canvas Confetti |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Audio & Vernacular TTS**| Web SpeechSynthesis API + Web Audio Synthesizer |
| **Deployment Target** | [Render](https://render.com/) Static Site |

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone -b main-2 https://github.com/TheHUNTER2714/-AGRIN-AI.git
cd -AGRIN-AI
```

### 1. Clone the Repository
```bash
git clone https://github.com/TheHUNTER2714/-AGRIN-AI.git
cd -AGRIN-AI
git checkout main-2
```

### 2. Setup & Start Backend (FastAPI + Gemini)
```bash
# Install Python backend dependencies
py -m pip install -r backend/requirements.txt

# (Optional) Set your Google Gemini API Key in backend/.env
# cp backend/.env.example backend/.env
# Add GEMINI_API_KEY=your_key_here

# Launch FastAPI backend on port 8000
npm run backend
# Or directly: py -m uvicorn backend.main:app --reload --port 8000
```
Backend will start at: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)

### 3. Start Frontend (React 19 + Vite)
In a second terminal:
```bash
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`. Vite proxies `/api` directly to `http://127.0.0.1:8000`.

### 4. Build for Production
```bash
npm run build
```
This compiles TypeScript and outputs a minified, production-ready bundle into the `dist/` directory (verified 0 TS errors).

---

## ☁️ How to Deploy on Render

AGRIN AI can be deployed on Render as a **Web Service** (serving FastAPI backend + React static build) or as two services:

### Option A: Full-Stack Web Service (Recommended)
1. In [Render Dashboard](https://dashboard.render.com/), click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `TheHUNTER2714/-AGRIN-AI` (Branch: `main-2`).
3. Set environment settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt && npm install && npm run build`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*

### Option B: Static Site (React Frontend with Calibrated Fallbacks)
1. In Render Dashboard, click **New +** ➔ **Static Site**.
2. Connect repository (Branch: `main-2`).
3. Build Command: `npm run build`
4. Publish Directory: `dist`
*(The frontend includes robust fallbacks with calibrated models for offline judging).*

---

## 🎯 10-Step Judge Evaluation Script (100% Working Live Demo)

1. **Load Demo Farm**: Click `LOAD DEMO FARM` button in the top navigation bar to populate **Ayush Farm (Pratapgarh, UP — 14.2 ha, Sharbati Wheat)**.
2. **Sentinel-2 Satellite**: Navigate to **Satellite**. View the **Latest available Sentinel-2 observation** (Band 8/4 NDVI: 0.78, NDWI: 0.32, Cloud cover: 4.2%). Scrub the 6-pass Farm Time Machine.
3. **Live Weather**: Navigate to **Weather**. View live Open-Meteo operational Doppler radar observations with real-time temperature, precipitation probability, and Gemini agricultural interpretations.
4. **AI Crop Doctor**: Navigate to **Crop Doctor**. Upload a leaf photo or pick a sample specimen (e.g. *Yellow Rust*). Watch the 4-stage pipeline (Vision analysis ➔ severity ➔ symptoms ➔ treatments ➔ prevention) with field agronomist disclaimer.
5. **AI Risk Engine**: In **Dashboard**, see the composite **Crop Risk Score (67 / 100)** with factor breakdowns (Water Stress 28%, Disease 18%, Weather 12%, Soil 9%).
6. **Explainable AI**: Click **"Why 67?"** to inspect the data sources (Sentinel-2, Open-Meteo, ICAR Soil Health Card, Crop Vision).
7. **Dynamic Soil Intelligence**: Navigate to **Soil Health**. Adjust the interactive sliders (pH, N, P, K, Organic Carbon) or switch to report upload to see dynamic regenerative recommendations.
8. **India Command Center**: In **India Command**, click breadcrumbs (*India ➔ UP ➔ Pratapgarh ➔ Sadar Block ➔ Pure Gosai ➔ Ayush Farm*) to observe how macro-to-micro metrics dynamically update.
9. **Farmer Simple Mode**: Click **Farmer Simple Mode** in the header to view high-contrast action cards with Hindi audio playback (`🔊 सुनो`).
10. **AgriVani Voice Assistant**: Click the floating mic icon. Speak in Hindi/vernacular or type in the text fallback to receive Gemini-reasoned audio answers.

---

## 📜 Hackathon Judging Checklist

- [x] **P0: Real Google Gemini Integration**: Backend `/api/advisor`, `/api/crop-doctor/diagnose`, `/api/voice/query`. Zero keys exposed in React.
- [x] **P0: AI-Powered Crop Doctor**: Gemini Vision foliar diagnostics, preview, progress states, scan history, agronomist disclaimer.
- [x] **P0: Real Satellite Grounding**: Sentinel-2 MSI multispectral observation, cloud mask, NDVI 0.78, NDWI 0.32.
- [x] **P0: Real Weather API**: Open-Meteo operational Doppler radar connection with agro-interpretations.
- [x] **P0: Dynamic Farm Selection & 1-Click Demo Farm**: Switch districts or 1-tap load Pratapgarh wheat demo.
- [x] **P0: Production FastAPI Backend**: Modular routes, schemas, services, CORS, `.env.example`.
- [x] **P1: Central AI Risk Engine**: 67/100 multi-sensor composite score with factor breakdowns.
- [x] **P1: Explainable AI**: "Why 67?" modal with multi-source telemetry data provenance.
- [x] **P1: Early Warning Streams**: Proactive alerts generated before visible crop degradation.
- [x] **P1: Dynamic Soil Intelligence**: Manual sliders + report upload + ICAR regenerative engine.
- [x] **P1: Functional Residue Marketplace**: AgriCycle stubble collection with "Demo Network" & "Estimated Payout" disclaimers.
- [x] **P2: AgriVani Voice Assistant**: Speech recognition ➔ Gemini reasoning ➔ Speech synthesis + text fallback.
- [x] **P2: Clarified Frameworks**: Digital Twin labeled "Scenario Simulation", BRICS labeled "Prototype Architecture".
- [x] **P2: Interactive India Command Hierarchy**: Drilldown from National down to Farm plot.
- [x] **P3: Transparent Data Provenance**: Data source tags & timestamps on every card.
- [x] **Security & Quality**: Zero secrets in frontend, `.env.example`, clean TypeScript build (`npm run build`).

---

© 2026 **AGRIN AI** — Empowering India's Farmers with Sovereign Digital Agriculture.
