# 🌾 AgriVision AI: Crop Advisory & Smart Farming Assistant

> **Production-grade agricultural intelligence platform** designed for farmers, agronomists, agricultural extension officers, and farm managers. Delivering real-time, location-specific, climate-aware crop advisories, multimodal plant leaf disease diagnostics, soil fertility optimization plans, irrigation schedules, and market commodity forecasts.

---

## 🚀 Key Features

1. **Multimodal Plant Disease Diagnostics**:
   - Visual analysis of crop leaf images powered by Google Gemini 2.5 Flash multimodal vision.
   - Outputs confidence scores, severity grades (Low, Moderate, Severe, Critical), observed symptoms, organic treatments, and precise chemical controls with PPE safety wear and pre-harvest intervals.
   - Live camera capture and drag-and-drop file upload with benchmark presets.

2. **Microclimate & Soil Advisory Engine**:
   - Multi-variable recommendation system factoring in pH, N-P-K balances, rainfall, season, irrigation method, and budget constraints.
   - Recharts dynamic Radar charts comparing current soil nutrients against ideal requirements.
   - Multi-stage fertilizer application timetable and critical growth stage irrigation timeline.

3. **Multi-Plot Farm Land Management**:
   - Dashboard to manage separate physical land plots with distinct soil profiles, acreage, and irrigation infrastructure.

4. **Localized Market Intelligence & ROI Estimator**:
   - Real-time commodity price tracking across cereals, pulses, cash crops, and vegetables.
   - AI market outlook and crop profitability predictor calculating gross revenue, production costs, and expected ROI percentage.

5. **Client-Side Field Report Export (PDF)**:
   - High-fidelity, print-ready field extension reports generated via `jspdf` and `html2canvas`.

6. **Authentication & Multi-Tenant Row Level Security (RLS)**:
   - Supabase PostgreSQL with strict RLS policies ensuring complete data isolation per registered farmer workspace.
   - Built-in 1-Click Demo Mode for instant exploration.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Lucide-React, Recharts, jsPDF, html2canvas, Axios, Zod.
- **Backend**: Node.js v20+, Express.js REST API, `@google/genai` SDK (`gemini-2.5-flash`), `@supabase/supabase-js`, Helmet, CORS, Morgan.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS).
- **Validation**: Shared Zod schemas in `shared/validators.js`.

---

## 📂 Project Structure

```text
agrivision-app/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, WeatherWidget, SoilMetricsForm, AdvisoryResultCard, etc.
│   │   ├── pages/              # Dashboard, Plots, NewAdvisory, Diagnostic, Market, History, Settings, Login
│   │   ├── context/            # AuthContext (Supabase + Demo)
│   │   ├── lib/                # API client and Supabase client singleton
│   │   ├── App.jsx             # React Router hierarchy
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express REST API
│   ├── config/                 # Gemini (@google/genai) and Supabase admin configs
│   ├── controllers/            # Advisory, Diagnostic, Plot, History, Market controllers
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Supabase JWT auth verification
│   ├── index.js                # Server entry point
│   └── package.json
├── shared/                     # Shared Zod runtime schemas
│   └── validators.js
├── database/                   # PostgreSQL schema and RLS policies
│   └── schema.sql
├── .env.example
└── README.md
```

---

## ⚙️ Quick Start & Installation

### 1. Database Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and execute the contents of `database/schema.sql`.

### 2. Configure Environment Variables
Copy `.env.example` into `server/.env` and `client/.env`:

**In `server/.env`**:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
CLIENT_ORIGIN=http://localhost:5173
```

**In `client/.env`**:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

*(Note: Even without API keys populated, AgriVision runs automatically in intelligent simulated development mode for full local testing).*

### 3. Run the Backend Server
```bash
cd server
npm install
npm run dev
# Server boots on http://localhost:5000
```

### 4. Run the Frontend Client
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 📄 License
MIT License. Built for precision farming and agricultural extension worldwide.
