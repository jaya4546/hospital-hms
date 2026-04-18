const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Tell the server where your files are
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = "mongodb://jayachander089:jayachander089@cluster0-shard-00-00.p7qf8.mongodb.net:27017,cluster0-shard-00-01.p7qf8.mongodb.net:27017,cluster0-shard-00-02.p7qf8.mongodb.net:27017/SRR_Hospital?ssl=true&replicaSet=atlas-m18f9v-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.error("❌ DB Error:", err));

const Patient = mongoose.model('Patient', new mongoose.Schema({
    opd_no: String, name: String, age: String, sex: String, 
    date: String, village: String, phone: String, 
    bp: String, temp: String, complaints: String, investigations: String
}));

// 2. THE FIX: If anyone goes to the main link, send them the dashboard.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Routes
app.get('/get-patients', async (req, res) => {
    const p = await Patient.find().sort({ _id: -1 });
    res.json(p);
});

app.post('/register-patient', async (req, res) => {
    try {
        const n = new Patient(req.body);
        await n.save();
        res.status(200).send("Saved");
    } catch (e) { res.status(500).send(e); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));