const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// This tells the server to serve your dashboard.html from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. DATABASE CONNECTION ---
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Cloud'))
    .catch(err => console.error('❌ MongoDB Error:', err));

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
// This redirects the main link directly to your dashboard
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 SRR Hospital System is LIVE at port ${PORT}`);
});