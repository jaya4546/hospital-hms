const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// DOCTOR: This is the Direct Shard connection. 
// It is long, but it is the ONLY way to bypass the "ENOTFOUND" error on Render.
const mongoURI = "mongodb://jayachander089:jayachander089@cluster0-shard-00-00.p7qf8.mongodb.net:27017,cluster0-shard-00-01.p7qf8.mongodb.net:27017,cluster0-shard-00-02.p7qf8.mongodb.net:27017/SRR_Hospital?ssl=true&replicaSet=atlas-m18f9v-shard-0&authSource=admin&retryWrites=true&w=majority";

async function connectDB() {
    try {
        // We set the timeout to 10 seconds to ensure it has time to link up
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000 
        });
        console.log("✅ SUCCESS: Database linked to Sri Raja Rajeshwari Hospital");
    } catch (err) {
        console.error("❌ Connection failed still:", err.message);
        setTimeout(connectDB, 5000);
    }
}
connectDB();

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
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));