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

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` to explore AgriN.

### 4. Build for Production
```bash
npm run build
```
This compiles TypeScript and outputs a minified, production-ready bundle into the `dist/` directory.

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## ☁️ How to Deploy on Render

AGRIN AI is built as a lightning-fast single-page web app and is fully configured for zero-friction deployment on [Render](https://render.com/).

### Deployment Steps on Render:
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Static Site**.
3. Connect your GitHub repository: `TheHUNTER2714/-AGRIN-AI`.
4. Configure the build settings:
   - **Name**: `agrin-ai`
   - **Branch**: `main-2`
   - **Root Directory**: (Leave blank for repository root)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**.
6. Render will automatically build the project and deploy it to a public URL (e.g., `https://agrin-ai.onrender.com`).

---

## 📜 Hackathon Judging Checklist

- [x] **Solves Core Problem**: Real-time satellite, climate, and soil guidance for smallholder farmers.
- [x] **AI Farm Digital Twin**: Interactive 2.5D what-if simulation (+30% rain, -20% irrigation).
- [x] **Explainable AI**: "Why?" button on advisories showing multi-source sensor fusion.
- [x] **Satellite Time Machine**: Interactive scrubber with HEALTHY ➔ STRESSED ➔ RECOVERY transitions.
- [x] **Digital Public Good**: Multi-tier Farmer ➔ FPO ➔ State Gov architecture + BRICS Model Exchange.
- [x] **Farmer Accessibility**: Audio-first Simple Mode in Hindi + AgriVani voice assistant in 22 languages.
- [x] **Circular Economy**: AgriCycle stubble collection network turning residue into farmer revenue.
- [x] **Atmospheric Living UI**: Climate-responsive dynamic environment.
- [x] **Clean Production Build**: 0 TypeScript errors, 100% verified with `vite build`.

---

© 2026 **AGRIN AI** — Empowering India's Farmers with Sovereign Digital Agriculture.
