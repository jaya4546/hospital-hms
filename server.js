const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Standard connection string - matches the user you are creating now
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ DATABASE CONNECTED SUCCESSFULLY"))
    .catch(err => console.error("❌ DATABASE CONNECTION ERROR:", err.message));

const Patient = mongoose.model('Patient', new mongoose.Schema({}, { strict: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/get-patients', async (req, res) => {
    try {
        const p = await Patient.find().sort({ _id: -1 });
        res.json(p);
    } catch (e) { res.status(500).json([]); }
});

app.post('/register-patient', async (req, res) => {
    try {
        const n = new Patient(req.body);
        await n.save();
        res.status(200).json({ message: "Success" });
    } catch (e) { 
        console.error("Save Error:", e.message);
        res.status(500).json({ error: e.message }); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 HMS Server Ready`));