const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Standard Connection String (More stable for Render)
const mongoURI = "mongodb://jayachander089:jayachander089@cluster0-shard-00-00.p7qf8.mongodb.net:27017,cluster0-shard-00-01.p7qf8.mongodb.net:27017,cluster0-shard-00-02.p7qf8.mongodb.net:27017/SRR_Hospital?ssl=true&replicaSet=atlas-m18f9v-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ Database Error:", err));

const patientSchema = new mongoose.Schema({
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
    complaints: { type: String, default: "" },
    investigations: { type: String, default: "" },
    notes: { type: String, default: "" },
    medicines: { type: Array, default: [] }
});
const Patient = mongoose.model('Patient', patientSchema);

app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ _id: -1 });
        res.json(patients);
    } catch (err) { res.status(500).json(err); }
});

app.post('/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(200).json({ message: "Success" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/get-patient/:opd', async (req, res) => {
    try {
        const patient = await Patient.findOne({ opd_no: req.params.opd });
        res.json(patient);
    } catch (err) { res.status(500).json(err); }
});

app.post('/update-full-patient', async (req, res) => {
    try {
        const { opd_no, ...updateData } = req.body;
        await Patient.findOneAndUpdate({ opd_no: opd_no }, { $set: updateData });
        res.status(200).json({ message: "Updated" });
    } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));