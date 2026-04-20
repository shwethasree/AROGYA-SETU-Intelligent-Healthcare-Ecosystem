// ─── Database Seeder ─────────────────────────────────────────────────────────
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Patient, Doctor, Hospital, Pharmacy, Medicine, OutbreakReport } = require('./models');

async function seed() {
  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await sequelize.authenticate();

    console.log('🏗️  Syncing tables (force: true — drops & recreates)...');
    await sequelize.sync({ force: true });

    // ── Users ──────────────────────────────────────────────────────────────
    console.log('👤 Seeding users...');
    const hash = async pw => bcrypt.hash(pw, 10);

    const users = await User.bulkCreate([
      { name:'Rahul Verma',      email:'patient@arogya.in',  passwordHash: await hash('demo123'), role:'patient',    city:'Delhi',   state:'Delhi',         phone:'9876543210' },
      { name:'Dr. Priya Sharma', email:'doctor@arogya.in',   passwordHash: await hash('demo123'), role:'doctor',     city:'Mumbai',  state:'Maharashtra',   phone:'9123456789' },
      { name:'Dr. Arjun Mehta',  email:'doctor2@arogya.in',  passwordHash: await hash('demo123'), role:'doctor',     city:'Delhi',   state:'Delhi',         phone:'9234567890' },
      { name:'Dr. Sneha Patel',  email:'doctor3@arogya.in',  passwordHash: await hash('demo123'), role:'doctor',     city:'Pune',    state:'Maharashtra',   phone:'9345678901' },
      { name:'AIIMS Admin',      email:'hospital@arogya.in', passwordHash: await hash('demo123'), role:'hospital',   city:'Delhi',   state:'Delhi',         phone:'9456789012' },
      { name:'MedPlus Manager',  email:'pharmacy@arogya.in', passwordHash: await hash('demo123'), role:'pharmacy',   city:'Mumbai',  state:'Maharashtra',   phone:'9567890123' },
      { name:'Govt Officer',     email:'gov@arogya.in',      passwordHash: await hash('demo123'), role:'government', city:'Delhi',   state:'Delhi',         phone:'9678901234' },
      { name:'Sunita Devi',      email:'sunita@arogya.in',   passwordHash: await hash('demo123'), role:'patient',    city:'Lucknow', state:'Uttar Pradesh', phone:'9789012345' },
      { name:'Meera Joshi',      email:'meera@arogya.in',    passwordHash: await hash('demo123'), role:'patient',    city:'Pune',    state:'Maharashtra',   phone:'9890123456' },
    ]);

    // ── Patients ───────────────────────────────────────────────────────────
    console.log('🤒 Seeding patients...');
    await Patient.bulkCreate([
      { userId: users[0].id, age:29, gender:'Male',   bloodGroup:'B+', chronicConditions:'Hypertension', emergencyContact:'9876543211' },
      { userId: users[7].id, age:45, gender:'Female', bloodGroup:'O+', chronicConditions:'Type 2 Diabetes', emergencyContact:'9789012346' },
      { userId: users[8].id, age:34, gender:'Female', bloodGroup:'A-', chronicConditions:'Migraine', emergencyContact:'9890123457' },
    ]);

    // ── Hospitals ──────────────────────────────────────────────────────────
    console.log('🏥 Seeding hospitals...');
    const hospitals = await Hospital.bulkCreate([
      { name:'AIIMS Delhi',       type:'Government', address:'Ansari Nagar, New Delhi', city:'Delhi',  state:'Delhi',        latitude:28.5665, longitude:77.2100, phone:'011-26588500', totalBeds:2500, availableBeds:320, icuBeds:80, emergencyBeds:50, rating:4.8 },
      { name:'Apollo Hospitals',  type:'Private',    address:'Mathura Road, New Delhi', city:'Delhi',  state:'Delhi',        latitude:28.5431, longitude:77.2510, phone:'011-26925858', totalBeds:700,  availableBeds:65,  icuBeds:15, emergencyBeds:20, rating:4.6 },
      { name:'Fortis Hospital',   type:'Private',    address:'Shalimar Bagh, Delhi',    city:'Delhi',  state:'Delhi',        latitude:28.7198, longitude:77.1496, phone:'011-45431000', totalBeds:250,  availableBeds:38,  icuBeds:12, emergencyBeds:8,  rating:4.4 },
      { name:'Lilavati Hospital', type:'Private',    address:'Bandra West, Mumbai',     city:'Mumbai', state:'Maharashtra',  latitude:19.0530, longitude:72.8277, phone:'022-26751000', totalBeds:323,  availableBeds:45,  icuBeds:18, emergencyBeds:10, rating:4.5 },
      { name:'KEM Hospital',      type:'Government', address:'Parel, Mumbai',           city:'Mumbai', state:'Maharashtra',  latitude:18.9962, longitude:72.8418, phone:'022-24137401', totalBeds:1800, availableBeds:200, icuBeds:60, emergencyBeds:40, rating:4.2 },
    ]);

    // ── Doctors ────────────────────────────────────────────────────────────
    console.log('👨‍⚕️ Seeding doctors...');
    await Doctor.bulkCreate([
      { userId:users[1].id, hospitalId:hospitals[0].id, specialty:'Cardiologist',      licenseNumber:'MCI/123/2015', experienceYrs:12, consultationFee:1500, rating:4.9, isAvailable:true },
      { userId:users[2].id, hospitalId:hospitals[0].id, specialty:'General Physician', licenseNumber:'MCI/456/2018', experienceYrs:8,  consultationFee:500,  rating:4.7, isAvailable:true },
      { userId:users[3].id, hospitalId:hospitals[3].id, specialty:'Neurologist',       licenseNumber:'MCI/789/2016', experienceYrs:10, consultationFee:1200, rating:4.8, isAvailable:false },
    ]);

    // ── Pharmacies ─────────────────────────────────────────────────────────
    console.log('💊 Seeding pharmacies...');
    await Pharmacy.bulkCreate([
      { name:'MedPlus Pharmacy – Connaught Place', city:'Delhi',  state:'Delhi',       latitude:28.6315, longitude:77.2167, phone:'011-11112222', isOpen:true, medicineCount:1200 },
      { name:'Apollo Pharmacy – Bandra',           city:'Mumbai', state:'Maharashtra', latitude:19.0596, longitude:72.8295, phone:'022-33334444', isOpen:true, medicineCount:850  },
      { name:'Jan Aushadhi Store – Saket',         city:'Delhi',  state:'Delhi',       latitude:28.5244, longitude:77.2066, phone:'011-55556666', isOpen:true, medicineCount:500  },
    ]);

    // ── Medicines ──────────────────────────────────────────────────────────
    console.log('🧪 Seeding medicines...');
    await Medicine.bulkCreate([
      { name:'Paracetamol 500mg', brand:'Crocin',   genericName:'Paracetamol',  category:'Analgesic',  price:12,  requiresPrescription:false, inStock:true },
      { name:'Amoxicillin 500mg', brand:'Mox',      genericName:'Amoxicillin',  category:'Antibiotic', price:85,  requiresPrescription:true,  inStock:true },
      { name:'Metformin 500mg',   brand:'Glucomin', genericName:'Metformin',    category:'Diabetes',   price:45,  requiresPrescription:true,  inStock:true },
      { name:'Amlodipine 5mg',    brand:'Amlip',    genericName:'Amlodipine',   category:'Cardiac',    price:55,  requiresPrescription:true,  inStock:true },
      { name:'Omeprazole 20mg',   brand:'Omez',     genericName:'Omeprazole',   category:'GI',         price:35,  requiresPrescription:false, inStock:true },
      { name:'Atorvastatin 10mg', brand:'Atorva',   genericName:'Atorvastatin', category:'Cardiac',    price:65,  requiresPrescription:true,  inStock:true },
      { name:'Cetirizine 10mg',   brand:'Cetzine',  genericName:'Cetirizine',   category:'Allergy',    price:25,  requiresPrescription:false, inStock:true },
      { name:'Azithromycin 500mg',brand:'Azithral', genericName:'Azithromycin', category:'Antibiotic', price:120, requiresPrescription:true,  inStock:false },
    ]);

    // ── Outbreak Data ──────────────────────────────────────────────────────
    console.log('🗺️  Seeding outbreak data...');
    await OutbreakReport.bulkCreate([
      { region:'Delhi',     state:'Delhi',          disease:'Dengue',        cases:4200, deaths:12, recovered:3800, severity:'High',   latitude:28.6139, longitude:77.2090 },
      { region:'Pune',      state:'Maharashtra',    disease:'COVID-19',      cases:2400, deaths:8,  recovered:2100, severity:'High',   latitude:18.5204, longitude:73.8567 },
      { region:'Mumbai',    state:'Maharashtra',    disease:'Leptospirosis', cases:3100, deaths:5,  recovered:2700, severity:'Medium', latitude:19.0760, longitude:72.8777 },
      { region:'Kolkata',   state:'West Bengal',    disease:'Malaria',       cases:1800, deaths:6,  recovered:1500, severity:'Medium', latitude:22.5726, longitude:88.3639 },
      { region:'Chennai',   state:'Tamil Nadu',     disease:'Chikungunya',   cases:900,  deaths:2,  recovered:780,  severity:'Low',    latitude:13.0827, longitude:80.2707 },
      { region:'Hyderabad', state:'Telangana',      disease:'Dengue',        cases:1200, deaths:3,  recovered:980,  severity:'Medium', latitude:17.3850, longitude:78.4867 },
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('   👤 9 users | 🏥 5 hospitals | 👨‍⚕️ 3 doctors | 💊 8 medicines | 🗺️ 6 outbreak regions');
    console.log('\n🔑 Login: patient@arogya.in / demo123\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
