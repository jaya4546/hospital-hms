const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// Serves files from the 'public' folder (dashboard.html must be inside 'public')
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. DATABASE CONNECTION ---
// Using the stable connection string for SRR Hospital Database
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Cloud'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// --- 3. PATIENT DATA MODEL ---
const PatientSchema = new mongoose.Schema({
    name: String,
    ageSex: String,
    complaints: String,
    investigations: String,
    prescription: String,
    date: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', PatientSchema);

// --- 4. THE HOME ROUTE ---
// Automatically opens your dashboard when you visit the main link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// --- 5. API ROUTE TO SAVE DATA ---
app.post('/api/patients', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json({ message: "Patient Data Saved Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 6. START SERVER ---
// Render will automatically assign a port, or use 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 SRR Hospital System is LIVE`);
});