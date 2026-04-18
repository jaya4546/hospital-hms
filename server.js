const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

/** * DOCTOR: This URI uses the user 'jayachander089' you are creating now.
 * Ensure the password and username match exactly in your MongoDB "Database Users" tab.
 */
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ DATABASE CONNECTED SUCCESSFULLY"))
    .catch(err => console.error("❌ DATABASE CONNECTION ERROR:", err.message));

// Flexible schema to allow for all patient details
const Patient = mongoose.model('Patient', new mongoose.Schema({
    opd_no: String,
    name: String,
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
    complaints: String,
    investigations: String,
    notes: String,
    medicines: Array
}, { strict: false }));

// ROUTE: Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ROUTE: Get all records for the table
app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json([]);
    }
});

// ROUTE: Register new patient
app.post('/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        console.log("✅ New patient saved to Cloud");
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("❌ Save Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ROUTE: Get details for "Treat" button
app.get('/get-patient/:opd', async (req, res) => {
    try {
        const patient = await Patient.findOne({ opd_no: req.params.opd });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: "Not found" });
    }
});

// ROUTE: Update treatment details
app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        await Patient.findOneAndUpdate({ opd_no: opd_no }, { $set: updateData });
        res.status(200).json({ message: "Update Successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Hospital Server is running on Port ${PORT}`);
});