const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- UPDATED CLOUD CONNECTION (STANDARD FORMAT) ---
// This version is more stable for hospital networks and firewalls
const cloudMongoURI = 'mongodb://admin:HospitalPassword123@cluster0-shard-00-00.oddbd8i.mongodb.net:27017,cluster0-shard-00-01.oddbd8i.mongodb.net:27017,cluster0-shard-00-02.oddbd8i.mongodb.net:27017/hospitalDB?ssl=true&replicaSet=atlas-oddbd8i-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(cloudMongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Successfully Connected to MongoDB ATLAS (Cloud)"))
.catch(err => {
    console.error("❌ MongoDB Cloud Error Details:");
    console.error(err);
});
// --- CONNECTION END ---

const patientSchema = new mongoose.Schema({
    opd_no: { type: String, required: true, unique: true },
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
    medicines: [{ drugName: String, duration: String, route: String, remarks: String }]
});

const Patient = mongoose.model('Patient', patientSchema);

// API Endpoints
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
        res.status(200).send({ message: "Saved to Cloud" });
    } catch (error) { res.status(500).send(error); }
});

app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        await Patient.findOneAndUpdate({ opd_no: opd_no }, { $set: updateData });
        res.status(200).send({ message: "Cloud Update Successful" });
    } catch (err) { res.status(500).send(err); }
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
    console.log("🏥 Sri Raja Rajeshwari Hospital System is LIVE");
});