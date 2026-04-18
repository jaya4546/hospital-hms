const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DOCTOR: I have added 'admin' authSource to ensure your new user is recognized
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority&authSource=admin";

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ HMS Cloud Database Connected");
    } catch (err) {
        console.error("❌ Connection Failed:", err.message);
        setTimeout(connectDB, 5000);
    }
}
connectDB();

// Schema - We use 'strict: false' so it never rejects data
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
        console.log("Saving patient...");
        const newPatient = new Patient(req.body);
        const saved = await newPatient.save();
        console.log("✅ Saved ID:", saved._id);
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("❌ Save Error Details:", error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Hospital System Live on Port ${PORT}`));