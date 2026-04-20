// Mock data for all pages

export const mockDoctors = [
  { id: 1, name: "Dr. Priya Sharma", specialty: "Cardiologist", location: "Mumbai", rating: 4.9, experience: 14, fee: 800, available: true, img: null, patients: 2400, reviews: 312 },
  { id: 2, name: "Dr. Arjun Mehta", specialty: "General Physician", location: "Delhi", rating: 4.7, experience: 8, fee: 500, available: true, img: null, patients: 1800, reviews: 245 },
  { id: 3, name: "Dr. Sneha Patel", specialty: "Neurologist", location: "Pune", rating: 4.8, experience: 12, fee: 1200, available: false, img: null, patients: 3100, reviews: 410 },
  { id: 4, name: "Dr. Rajesh Kumar", specialty: "Orthopedic", location: "Bangalore", rating: 4.6, experience: 20, fee: 900, available: true, img: null, patients: 5000, reviews: 680 },
  { id: 5, name: "Dr. Neha Singh", specialty: "Dermatologist", location: "Hyderabad", rating: 4.9, experience: 7, fee: 700, available: true, img: null, patients: 1200, reviews: 190 },
  { id: 6, name: "Dr. Vikram Bose", specialty: "Pediatrician", location: "Kolkata", rating: 4.5, experience: 15, fee: 600, available: false, img: null, patients: 2100, reviews: 290 },
];

export const mockHospitals = [
  { id: 1, name: "AIIMS Delhi", type: "Government", lat: 28.5665, lng: 77.2100, beds: { total: 2500, available: 320, icu: 80, emergency: 45 }, distance: "2.3 km", rating: 4.8 },
  { id: 2, name: "Apollo Hospitals", type: "Private", lat: 28.5450, lng: 77.2200, beds: { total: 700, available: 65, icu: 15, emergency: 10 }, distance: "4.1 km", rating: 4.9 },
  { id: 3, name: "Safdarjung Hospital", type: "Government", lat: 28.5700, lng: 77.2070, beds: { total: 1500, available: 180, icu: 40, emergency: 22 }, distance: "3.5 km", rating: 4.5 },
  { id: 4, name: "Fortis Healthcare", type: "Private", lat: 28.5600, lng: 77.2190, beds: { total: 400, available: 30, icu: 8, emergency: 6 }, distance: "5.2 km", rating: 4.7 },
];

export const mockPharmacies = [
  { id: 1, name: "MedPlus Pharmacy", location: "Connaught Place, Delhi", distance: "0.8 km", open: true, medicines: 12400 },
  { id: 2, name: "Apollo Pharmacy", location: "Lajpat Nagar, Delhi", distance: "2.1 km", open: true, medicines: 9800 },
  { id: 3, name: "Wellness Forever", location: "Sarojini Nagar, Delhi", distance: "3.4 km", open: false, medicines: 7500 },
];

export const mockMedicines = [
  { name: "Paracetamol 500mg", brand: "Crocin", price: 12, available: true, category: "Pain Relief" },
  { name: "Azithromycin 500mg", brand: "Zithromax", price: 85, available: true, category: "Antibiotic" },
  { name: "Metformin 500mg", brand: "Glucophage", price: 45, available: false, category: "Diabetes" },
  { name: "Amlodipine 5mg", brand: "Norvasc", price: 60, available: true, category: "Cardio" },
];

export const symptomsDatabase = {
  "fever": ["Malaria", "Dengue", "Typhoid", "COVID-19", "Influenza"],
  "cough": ["COVID-19", "Influenza", "Pneumonia", "Bronchitis", "Tuberculosis"],
  "chest pain": ["Cardiac Arrest Risk", "Pneumonia", "Pulmonary Embolism", "GERD"],
  "headache": ["Migraine", "Hypertension", "Meningitis", "Tension Headache"],
  "fatigue": ["Anemia", "Diabetes", "Hypothyroidism", "Depression", "Chronic Fatigue"],
  "nausea": ["Gastroenteritis", "Appendicitis", "Food Poisoning"],
  "shortness of breath": ["Asthma", "COVID-19", "Heart Failure", "Pulmonary Embolism"],
  "joint pain": ["Arthritis", "Dengue", "Lyme Disease", "Gout"],
  "rash": ["Dengue", "Allergy", "Chickenpox", "Psoriasis"],
  "dizziness": ["Vertigo", "Hypertension", "Anemia", "Dehydration"],
};

export const diseaseRiskMap = {
  "COVID-19": { risk: "High", color: "red", recommendation: "Isolate immediately and get tested. Book teleconsultation." },
  "Malaria": { risk: "High", color: "red", recommendation: "Visit nearest malaria clinic. Get blood test done." },
  "Dengue": { risk: "Medium", color: "orange", recommendation: "Rest, hydrate well. Monitor platelet count. Visit doctor." },
  "Migraine": { risk: "Low", color: "green", recommendation: "Rest in dark room. OTC pain relief. Book appointment if recurring." },
  "Influenza": { risk: "Medium", color: "orange", recommendation: "Rest, fluids, paracetamol. See doctor if symptoms worsen." },
  "Cardiac Arrest Risk": { risk: "Critical", color: "red", recommendation: "EMERGENCY: Call ambulance immediately! Do not delay." },
  "Appendicitis": { risk: "Critical", color: "red", recommendation: "EMERGENCY: Rush to nearest hospital immediately." },
  "Gastroenteritis": { risk: "Low", color: "green", recommendation: "Hydrate well. ORS solution. See doctor if > 48hrs." },
};

export const outbreakData = [
  { region: "Delhi", cases: 4200, disease: "Dengue", lat: 28.7041, lng: 77.1025, severity: "High" },
  { region: "Mumbai", cases: 3100, disease: "Leptospirosis", lat: 19.0760, lng: 72.8777, severity: "Medium" },
  { region: "Kolkata", cases: 1800, disease: "Malaria", lat: 22.5726, lng: 88.3639, severity: "Medium" },
  { region: "Chennai", cases: 900, disease: "Chikungunya", lat: 13.0827, lng: 80.2707, severity: "Low" },
  { region: "Hyderabad", cases: 650, disease: "COVID-19", lat: 17.3850, lng: 78.4867, severity: "Low" },
  { region: "Pune", cases: 2400, disease: "COVID-19", lat: 18.5204, lng: 73.8567, severity: "High" },
];

export const healthMetrics = {
  heartRate: { value: 72, unit: "bpm", status: "normal", trend: +2 },
  spo2: { value: 98, unit: "%", status: "normal", trend: 0 },
  temperature: { value: 98.6, unit: "°F", status: "normal", trend: -0.2 },
  bloodPressure: { value: "120/80", unit: "mmHg", status: "normal" },
  glucose: { value: 95, unit: "mg/dL", status: "normal", trend: -3 },
  healthScore: 84,
};

export const digitalTwinRisks = [
  { disease: "Type 2 Diabetes", probability: 18, level: "Low", icon: "🩸" },
  { disease: "Hypertension", probability: 32, level: "Moderate", icon: "❤️" },
  { disease: "Heart Disease", probability: 12, level: "Low", icon: "🫀" },
  { disease: "Obesity Risk", probability: 24, level: "Low", icon: "⚖️" },
];

export const weeklyHealthData = [
  { day: "Mon", heartRate: 70, spo2: 97, steps: 7200 },
  { day: "Tue", heartRate: 75, spo2: 98, steps: 9100 },
  { day: "Wed", heartRate: 68, spo2: 99, steps: 6300 },
  { day: "Thu", heartRate: 80, spo2: 97, steps: 11000 },
  { day: "Fri", heartRate: 72, spo2: 98, steps: 8400 },
  { day: "Sat", heartRate: 65, spo2: 99, steps: 5200 },
  { day: "Sun", heartRate: 71, spo2: 98, steps: 7800 },
];

export const mockPatients = [
  { id: 1, name: "Rahul Verma", age: 34, condition: "Hypertension", appointment: "10:00 AM", status: "Confirmed", lastVisit: "2025-03-20" },
  { id: 2, name: "Sunita Devi", age: 55, condition: "Diabetes Type 2", appointment: "11:30 AM", status: "Waiting", lastVisit: "2025-04-01" },
  { id: 3, name: "Aryan Kapoor", age: 28, condition: "Asthma", appointment: "02:00 PM", status: "Confirmed", lastVisit: "2025-02-14" },
  { id: 4, name: "Meera Joshi", age: 42, condition: "Migraine", appointment: "03:30 PM", status: "Rescheduled", lastVisit: "2025-03-05" },
];

export const govStats = {
  totalCases: 182400,
  activeCases: 4280,
  recovered: 174600,
  hospitals: 1240,
  doctors: 48000,
  vaccinated: 1240000,
};
