const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const PORT = 4000;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Helper to get base URL with secure protocol on production
function getBaseUrl(req) {
  const host = req.get('host');
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial Database Seeding (Doctors from CareConnect-NativeApp assets)
function checkAndSeedDB() {
  if (!fs.existsSync(DB_FILE)) {
    const doctorsList = [
      {
        _id: "doc1",
        name: "Dr. Richard James",
        imageKey: "doc1",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. He specializes in managing chronic diseases and promoting overall wellness.",
        fees: 50,
        address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc2",
        name: "Dr. Emily Larson",
        imageKey: "doc2",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        about: "Dr. Emily Larson is a compassionate gynecologist specializing in women's reproductive health, prenatal care, and minimally invasive surgeries. She ensures every patient is informed and comfortable throughout their care journey.",
        fees: 60,
        address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc3",
        name: "Dr. Sarah Patel",
        imageKey: "doc3",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        about: "Dr. Sarah Patel is a skilled dermatologist specializing in skin care, acne treatment, hair loss, and cosmetic procedures. She combines cutting-edge dermatology techniques with a personalized approach to achieve the best outcomes.",
        fees: 30,
        address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc4",
        name: "Dr. Christopher Lee",
        imageKey: "doc4",
        speciality: "Pediatricians",
        degree: "MBBS",
        experience: "2 Years",
        about: "Dr. Christopher Lee is a dedicated pediatrician who provides comprehensive care for children from newborns to adolescents. His gentle approach makes children feel at ease during consultations and treatments.",
        fees: 40,
        address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc5",
        name: "Dr. Jennifer Garcia",
        imageKey: "doc5",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Jennifer Garcia specializes in diagnosing and treating disorders of the nervous system including migraines, epilepsy, stroke, and Parkinson's disease. She provides comprehensive neurological evaluations and personalized care plans.",
        fees: 50,
        address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc6",
        name: "Dr. Andrew Williams",
        imageKey: "doc6",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Andrew Williams is a senior neurologist with deep expertise in movement disorders, neurodegenerative diseases, and clinical neurophysiology. He is highly regarded for his diagnostic precision and patient empathy.",
        fees: 50,
        address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc7",
        name: "Dr. Christopher Davis",
        imageKey: "doc7",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Christopher Davis is an experienced general physician dedicated to holistic patient care. He is known for his thorough examination techniques and patient-friendly approach to diagnosis and treatment.",
        fees: 50,
        address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc8",
        name: "Dr. Timothy White",
        imageKey: "doc8",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        about: "Dr. Timothy White has over 7 years of experience in obstetrics and gynecology. He is skilled in high-risk pregnancy management, laparoscopic procedures, and women's health consultations.",
        fees: 60,
        address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc9",
        name: "Dr. Ava Mitchell",
        imageKey: "doc9",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        about: "Dr. Ava Mitchell focuses on medical and cosmetic dermatology, treating conditions like psoriasis, eczema, fungal infections and providing aesthetic procedures like chemical peels and laser therapies.",
        fees: 30,
        address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc10",
        name: "Dr. Jeffrey King",
        imageKey: "doc10",
        speciality: "Pediatricians",
        degree: "MBBS",
        experience: "2 Years",
        about: "Dr. Jeffrey King has extensive experience in managing childhood diseases, developmental disorders, vaccinations, and nutritional guidance. He is known for his compassionate care and evidence-based treatment protocols.",
        fees: 40,
        address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc11",
        name: "Dr. Zoe Kelly",
        imageKey: "doc11",
        speciality: "Gastroenterologist",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Zoe Kelly specializes in digestive health, liver diseases, and gastrointestinal procedures like endoscopy and colonoscopy. She is known for her meticulous diagnostic approach and effective management of complex GI conditions.",
        fees: 50,
        address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc12",
        name: "Dr. Patrick Harris",
        imageKey: "doc12",
        speciality: "Neurologist",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Patrick Harris is an expert in treating conditions like IBS, Crohn's disease, ulcerative colitis, and GERD. His patient-first philosophy ensures accurate diagnosis and effective, minimally invasive treatment options.",
        fees: 50,
        address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc13",
        name: "Dr. Chloe Evans",
        imageKey: "doc13",
        speciality: "General physician",
        degree: "MBBS",
        experience: "4 Years",
        about: "Dr. Chloe Evans has extensive experience in internal medicine and general practice. She focuses on preventive care, vaccinations, and management of acute illnesses, ensuring every patient receives personalized care.",
        fees: 50,
        address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc14",
        name: "Dr. Ryan Martinez",
        imageKey: "doc14",
        speciality: "Gynecologist",
        degree: "MBBS",
        experience: "3 Years",
        about: "Dr. Ryan Martinez is a senior gynecologist with expertise in reproductive endocrinology, fertility treatments, and advanced laparoscopic surgeries. He brings world-class care to every patient.",
        fees: 60,
        address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      },
      {
        _id: "doc15",
        name: "Dr. Amelia Hill",
        imageKey: "doc15",
        speciality: "Dermatologist",
        degree: "MBBS",
        experience: "1 Years",
        about: "Dr. Amelia Hill is an experienced dermatologist with a special interest in pediatric dermatology and allergy-related skin conditions. She is well-regarded for her patient-centric and evidence-based approach.",
        fees: 30,
        address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
        available: true,
        slots_booked: {}
      }
    ];

    const initialDB = {
      doctors: doctorsList,
      users: [],
      appointments: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf8');
    console.log('Seeded database with initial doctors list.');
  }
}

// Seed the DB before configuring json-server
checkAndSeedDB();

// Setup json-server Router and default Middlewares
const router = jsonServer.router(DB_FILE);
const middlewares = jsonServer.defaults();

// Configure Multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `profile_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Apply default middlewares (logger, static, cors, no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Serve doctor images and profile uploads
server.use('/images', express.static(path.join(__dirname, 'src', 'assets')));
server.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Decode Token to Get User ID
function getUserIdFromToken(token) {
  if (!token || !token.startsWith('mock-token-')) return null;
  const parts = token.split('-');
  return parts[2] || null;
}

// Middleware: Authenticate Mock Token
function authUser(req, res, next) {
  const token = req.headers.token;
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  const user = router.db.get('users').find({ _id: userId }).value();
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  req.userId = userId;
  req.user = user;
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM API ENDPOINTS (mapped directly to lowdb instance of json-server)
// ─────────────────────────────────────────────────────────────────────────────

// 1. GET /api/doctor/list
server.get('/api/doctor/list', (req, res) => {
  const doctors = router.db.get('doctors').value() || [];
  const formattedDoctors = doctors.map(doc => ({
    ...doc,
    image: `${getBaseUrl(req)}/images/${doc.imageKey}.png`
  }));
  res.json({ success: true, doctors: formattedDoctors });
});

// 2. POST /api/user/register
server.post('/api/user/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  const existingUser = router.db.get('users').find({ email }).value();
  if (existingUser) {
    return res.json({ success: false, message: "Email already registered" });
  }

  const userId = `user_${Date.now()}`;
  const newUser = {
    _id: userId,
    name,
    email,
    password,
    phone: '',
    gender: 'Not Selected',
    dob: '',
    address: { line1: '', line2: '' },
    image: ''
  };

  router.db.get('users').push(newUser).write();

  const token = `mock-token-${userId}-${Math.random().toString(36).substr(2, 9)}`;
  res.json({ success: true, token });
});

// 3. POST /api/user/login
server.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Missing credentials" });
  }

  const user = router.db.get('users').find({ email }).value();
  if (!user || user.password !== password) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const token = `mock-token-${user._id}-${Math.random().toString(36).substr(2, 9)}`;
  res.json({ success: true, token });
});

// 4. GET /api/user/get-profile
server.get('/api/user/get-profile', authUser, (req, res) => {
  const userData = { ...req.user };
  delete userData.password;
  res.json({ success: true, userData });
});

// 5. POST /api/user/update-profile
server.post('/api/user/update-profile', upload.single('image'), authUser, (req, res) => {
  const { name, phone, address, dob, gender } = req.body;

  if (!name) {
    return res.json({ success: false, message: "Name is required" });
  }

  let parsedAddress = {};
  if (address) {
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      parsedAddress = {};
    }
  }

  const updates = {
    name,
    phone: phone || req.user.phone,
    address: parsedAddress,
    dob: dob || req.user.dob,
    gender: gender || req.user.gender,
  };

  if (req.file) {
    updates.image = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
  }

  router.db.get('users').find({ _id: req.userId }).assign(updates).write();
  res.json({ success: true, message: "Profile updated" });
});

// 6. POST /api/user/book-appointment
server.post('/api/user/book-appointment', authUser, (req, res) => {
  const { docId, slotDate, slotTime } = req.body;
  if (!docId || !slotDate || !slotTime) {
    return res.json({ success: false, message: "Missing appointment details" });
  }

  const doctor = router.db.get('doctors').find({ _id: docId }).value();
  if (!doctor) {
    return res.json({ success: false, message: "Doctor not found" });
  }
  if (!doctor.available) {
    return res.json({ success: false, message: "Doctor not available" });
  }

  const slots_booked = doctor.slots_booked || {};
  if (slots_booked[slotDate]) {
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }
    slots_booked[slotDate].push(slotTime);
  } else {
    slots_booked[slotDate] = [slotTime];
  }

  // Update slots_booked on the doctor object
  router.db.get('doctors').find({ _id: docId }).assign({ slots_booked }).write();

  // Create appointment
  const appointmentId = `appt_${Date.now()}`;
  const docInfoForAppt = { ...doctor };
  delete docInfoForAppt.slots_booked;
  docInfoForAppt.image = `${getBaseUrl(req)}/images/${docInfoForAppt.imageKey}.png`;

  const newAppointment = {
    _id: appointmentId,
    userId: req.userId,
    docId,
    userData: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      dob: req.user.dob,
      gender: req.user.gender,
      address: req.user.address,
      image: req.user.image
    },
    docData: docInfoForAppt,
    amount: doctor.fees,
    slotDate,
    slotTime,
    date: Date.now(),
    cancelled: false,
    isCompleted: false
  };

  router.db.get('appointments').push(newAppointment).write();
  res.json({ success: true, message: "Appointment booked" });
});

// 7. GET /api/user/appointments
server.get('/api/user/appointments', authUser, (req, res) => {
  const userAppts = router.db.get('appointments').filter({ userId: req.userId }).value() || [];
  res.json({ success: true, appointments: userAppts });
});

// 8. POST /api/user/cancel-appointment
server.post('/api/user/cancel-appointment', authUser, (req, res) => {
  const { appointmentId } = req.body;
  if (!appointmentId) {
    return res.json({ success: false, message: "Appointment ID is required" });
  }

  const appointment = router.db.get('appointments').find({ _id: appointmentId }).value();
  if (!appointment) {
    return res.json({ success: false, message: "Appointment not found" });
  }
  if (appointment.userId !== req.userId) {
    return res.json({ success: false, message: "Unauthorized action" });
  }

  // Update status to cancelled
  router.db.get('appointments').find({ _id: appointmentId }).assign({ cancelled: true }).write();

  // Release doctor slot
  const doctor = router.db.get('doctors').find({ _id: appointment.docId }).value();
  if (doctor && doctor.slots_booked && doctor.slots_booked[appointment.slotDate]) {
    const updatedSlots = doctor.slots_booked[appointment.slotDate].filter(
      time => time !== appointment.slotTime
    );
    const newSlotsBooked = { ...doctor.slots_booked, [appointment.slotDate]: updatedSlots };
    router.db.get('doctors').find({ _id: appointment.docId }).assign({ slots_booked: newSlotsBooked }).write();
  }

  res.json({ success: true, message: "Appointment cancelled" });
});

// Use json-server default router for fallback REST endpoints
server.use(router);

// Start json-server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 json-server is running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Local database file: ${DB_FILE}`);
});
