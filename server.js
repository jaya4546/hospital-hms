const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
// Serves your dashboard from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// CLOUD DATABASE CONNECTION
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Cloud MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

const patientSchema = new mongoose.Schema({
    opd_no: { type: String, required: true, unique: true },
    name: String, age: String, sex: String, 
    date: String, village: String, phone: String, 
    weight: String, temp: String, bp: String, pulse: String, spo2: String,
    complaints: String, investigations: String,
    notes: String,
    medicines: [{ drugName: String, duration: String, route: String, remarks: String }]
});
const Patient = mongoose.model('Patient', patientSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) { res.status(500).send(err); }
});

app.get('/get-patient/:opd', async (req, res) => {
    try {
        const patient = await Patient.findOne({ opd_no: req.params.opd });
        res.json(patient);
    } catch (err) { res.status(500).send(err); }
});

app.post('/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(200).send({ message: "Saved" });
    } catch (error) { res.status(500).send(error); }
});

app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        await Patient.findOneAndUpdate({ opd_no: opd_no }, { $set: updateData });
        res.status(200).send({ message: "Update Successful" });
    } catch (err) { res.status(500).send(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));