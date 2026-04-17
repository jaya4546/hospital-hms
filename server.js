const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CLOUD DATABASE CONNECTION
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Cloud MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// PATIENT SCHEMA
const patientSchema = new mongoose.Schema({
    opd_no: { type: String, required: true, unique: true },
    name: String, age: String, sex: String, 
    date: String, village: String, phone: String, 
    weight: String, temp: String, bp: String, pulse: String, spo2: String,
    complaints: { type: String, default: "" },
    investigations: { type: String, default: "" },
    notes: { type: String, default: "" },
    medicines: { type: Array, default: [] }
});
const Patient = mongoose.model('Patient', patientSchema);

// ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/get-patient/:opd', async (req, res) => {
    try {
        const patient = await Patient.findOne({ opd_no: req.params.opd });
        res.json(patient);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(200).json({ message: "Registration Successful" });
    } catch (error) { 
        console.error("Reg Error:", error);
        res.status(500).json({ error: error.message }); 
    }
});

app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        await Patient.findOneAndUpdate({ opd_no: opd_no }, { $set: updateData });
        res.status(200).json({ message: "Update Successful" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));