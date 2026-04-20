# 🏥 AROGYA-SETU — Intelligent Healthcare Ecosystem

> **"AI-powered healthcare access, diagnosis, monitoring, and emergency support for everyone."**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)](https://flask.palletsprojects.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?logo=leaflet)](https://leafletjs.com)

---

## 🌍 Problem Statement

India faces critical healthcare challenges:
- **1.4 billion people**, only **1 doctor per 1,457** patients (WHO recommends 1:1000)
- **70% of rural population** lacks access to quality healthcare
- **No unified platform** connecting patients, doctors, hospitals, pharmacies & government
- **Slow disease outbreak response** — weeks instead of hours
- **Lack of preventive healthcare** — most people visit doctors only when critically ill

---

## 💡 Our Solution: AROGYA-SETU

A **unified AI-powered healthcare ecosystem** that bridges the gap between all healthcare stakeholders through:

### 🧠 AI Health Digital Twin *(Unique Feature — No Other Team Has This)*
Every user gets a **virtual health model** that:
- Predicts future disease risks (Diabetes, Hypertension, Heart Disease)
- Provides personalized lifestyle recommendations
- Updates in real-time as health data changes
- Enables **preventive healthcare** before emergencies occur

---

## 🌐 Pages & Features

| Page | Features |
|------|----------|
| 🏠 **Homepage** | Hero, AI preview, services grid, outbreak map, features, testimonials |
| 🔐 **Login** | 5-role system: Patient / Doctor / Hospital / Pharmacy / Government |
| 🧠 **AI Symptom Checker** | Tag-based input, animated AI analysis, risk-colored disease predictions |
| 👨‍⚕️ **Find Doctors** | Filter by specialty/location, rating, booking modal with time slots |
| 🏥 **Hospitals Near Me** | Leaflet + OpenStreetMap live map, bed availability tracker |
| 💊 **Pharmacy** | Drag-drop prescription upload, medicine search, nearby pharmacy finder |
| ❤️ **Health Dashboard** | Vital signs, health score ring, radar chart, **AI Digital Twin** |
| 🚨 **Emergency** | Animated SOS countdown + dispatch, quick-call cards, nearest hospitals |
| 🩺 **Doctor Dashboard** | Patient queue, digital prescription modal, AI diagnosis suggestions |
| 🏨 **Hospital Dashboard** | Real-time adjustable bed counters, admission charts, emergency table |
| 🏛️ **Government Dashboard** | Disease outbreak heatmap, KPI cards, resource analytics, pie charts |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER LAYER                            │
│  Patient │ Doctor │ Hospital │ Pharmacy │ NGO │ Government   │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React + Vite)                    │
│  Tailwind CSS │ React Router │ Recharts │ Leaflet │ Lucide   │
└─────────────────────────┬────────────────────────────────────┘
                          │ REST API
┌─────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Flask / FastAPI)                   │
│  Auth │ Symptom AI │ Doctor API │ Hospital API │ Emergency   │
└──────────────┬───────────────────────────┬───────────────────┘
               │                           │
┌──────────────▼───────────┐  ┌────────────▼──────────────────┐
│   AI/ML Layer             │  │   Database (PostgreSQL)        │
│  Symptom Analysis         │  │  Users │ Appointments          │
│  Digital Twin Model       │  │  Health Data │ Prescriptions   │
│  Risk Prediction          │  │  Hospitals │ Outbreak Data     │
└──────────────────────────┘  └───────────────────────────────┘
```

---

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# API at http://localhost:5000
```

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@arogya.in | demo123 |
| Doctor | doctor@arogya.in | demo123 |
| Hospital | hospital@arogya.in | demo123 |
| Pharmacy | pharmacy@arogya.in | demo123 |
| Government | gov@arogya.in | demo123 |

---

## 🗄️ Database Schema

```sql
-- Core Tables
Users        (id, name, email, role, phone, location)
Patients     (id, user_id, blood_group, allergies, chronic_conditions)
Doctors      (id, user_id, specialty, license_no, hospital_id, rating)
Hospitals    (id, name, type, lat, lng, total_beds, icu_beds)
Appointments (id, patient_id, doctor_id, date, time, status)
Prescriptions(id, doctor_id, patient_id, medicines, notes, date)
SymptomLogs  (id, patient_id, symptoms[], predicted_disease, risk_level)
HealthData   (id, patient_id, heart_rate, spo2, temperature, timestamp)
OutbreakData (id, region, disease, cases, severity, reported_at)
```

---

## 🧠 AI Features

### 1. Symptom Checker Engine
- Maps symptoms → possible diseases using weighted probability
- Risk classification: Low / Medium / High / Critical
- Personalized recommendations per disease

### 2. AI Health Digital Twin
- Virtual health model per user
- Predicts: Diabetes, Hypertension, Heart Disease, Obesity
- Lifestyle recommendation engine
- Updates based on health monitoring data

### 3. Disease Outbreak Detection
- Geographic clustering of symptom reports
- Early warning system for disease spread
- Government alert broadcasting

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 8, TailwindCSS v3 |
| Routing | React Router v7 |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap (Free, no API key) |
| Icons | Lucide React |
| Backend | Python Flask 3.0 |
| Database | PostgreSQL (SQLite for demo) |
| AI/ML | Python scikit-learn / rule-based engine |

---

## 👥 Multi-Stakeholder Platform

```
Patients     → AI symptom check, book doctors, emergency help
Doctors      → Patient management, AI diagnosis, digital prescriptions  
Hospitals    → Bed management, emergency alerts, resource tracking
Pharmacies   → Prescription verification, stock management
Government   → Outbreak surveillance, hospital analytics
NGOs         → Health camp management, vulnerable patient identification
```

---

## 🏆 Hackathon Highlights

1. **🧠 AI Health Digital Twin** — Predictive, preventive healthcare (unique feature)
2. **🗺️ Real-time Outbreak Map** — Leaflet heatmap with disease surveillance
3. **👥 5-Role Architecture** — Complete ecosystem, not just a patient app
4. **📊 Live Analytics** — Hospital beds, disease trends, government KPIs
5. **🚨 Emergency System** — One-tap SOS with ambulance dispatch simulation
6. **💊 Digital Prescriptions** — Doctor → Patient medication management
7. **📱 Mobile Responsive** — Works on any device

---

*Built with ❤️ for India's healthcare — National Hackathon 2026
