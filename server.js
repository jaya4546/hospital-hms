const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CLOUD DATABASE CONNECTION STRING
// Ensure you have "Allowed Access from Anywhere (0.0.0.0/0)" in MongoDB Atlas Network Access
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of hanging
        });
        console.log("✅ Cloud MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// PATIENT SCHEMA
const patientSchema = new mongoose.Schema({
    opd_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: String,
    sex: String,
    date: String,
    village: String,
    phone: String,
    weight: String,
    temp: String,
    bp: String,
    pulse: String,
    spo2: String,
    complaints: { type: String, default: "" },
    investigations: { type: String, default: "" },
    notes: { type: String, default: "" },
    medicines: { type: Array, default: [] }
});

const Patient = mongoose.model('Patient', patientSchema);

// --- ROUTES ---

// 1. Serve Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 2. Register New Patient
app.post('/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        console.log(`New Patient Registered: ${req.body.name}`);
        res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        console.error("Registration Save Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 3. Get All Patients (For the table)
app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get Single Patient Details (For Treatment)
app.get('/get-patient/:opd', async (req, res) => {
    try {
        const patient = await Patient.findOne({ opd_no: req.params.opd });
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update Patient with Treatment/Medicines
app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        const updated = await Patient.findOneAndUpdate(
            { opd_no: opd_no },
            { $set: updateData },
            { new: true }
        );
        res.status(200).json({ message: "Update Successful", data: updated });
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server active on port ${PORT}`);
});