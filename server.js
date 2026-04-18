const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DOCTOR: This is the "Nuclear Option" connection string. 
// It bypasses the DNS issues that cause the ENOTFOUND error.
const mongoURI = "mongodb://jayachander089:jayachander089@cluster0-shard-00-00.p7qf8.mongodb.net:27017,cluster0-shard-00-01.p7qf8.mongodb.net:27017,cluster0-shard-00-02.p7qf8.mongodb.net:27017/SRR_Hospital?ssl=true&replicaSet=atlas-m18f9v-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        // We use specific settings here to ensure the connection is solid
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ SUCCESS: Sri Raja Rajeshwari Hospital Database Connected");
    } catch (err) {
        console.error("❌ DATABASE ERROR:", err.message);
        // Retry every 5 seconds if it fails
        setTimeout(connectDB, 5000);
    }
};

connectDB();

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

// API ROUTES
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
        console.error("Registration Error:", error.message);
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
app.listen(PORT, () => console.log(`🚀 HMS Server active on port ${PORT}`));