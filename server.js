const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DOCTOR: If this still fails, please ensure you DID NOT add symbols like @ in the password.
// If you did, recreate the user 'jayachander089' with just letters and numbers.
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Wait 10 seconds before giving up
            socketTimeoutMS: 45000,         // Close sockets after 45 seconds
        });
        console.log("✅ SUCCESS: Database Linked to Hospital System");
    } catch (err) {
        console.error("❌ DATABASE ERROR:", err.message);
        setTimeout(connectDB, 5000); // Auto-retry every 5 seconds
    }
};

connectDB();

const patientSchema = new mongoose.Schema({
    opd_no: String,
    name: String,
    age: String,
    sex: String,
    date: String,
    village: String,
    phone: String
}, { strict: false });

const Patient = mongoose.model('Patient', patientSchema);

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
app.listen(PORT, () => console.log(`🚀 HMS active on ${PORT}`));