const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- MONGODB CONNECTION ---
// Replace the <password> with your actual MongoDB password if not already done
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Successfully Connected to MongoDB ATLAS (Cloud)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- THE HOME ROUTE (Fixes "Cannot GET /") ---
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #2c3e50;">Sri Raja Rajeshwari Hospital</h1>
            <p style="color: #27ae60; font-weight: bold;">✔ System Status: Online & Cloud Connected</p>
            <hr style="width: 50%; margin: 20px auto;">
            <p>Welcome, Dr. Jayachander. Your Hospital Management System is ready.</p>
            <div style="margin-top: 30px;">
                <button onclick="alert('Redirecting to OPD...')" style="padding: 10px 20px; cursor: pointer;">Go to OPD Module</button>
            </div>
        </div>
    `);
});

// --- SAMPLE API ROUTE FOR PATIENTS ---
app.get('/api/status', (req, res) => {
    res.json({ message: "Hospital API is working perfectly." });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 Sri Raja Rajeshwari Hospital System is LIVE`);
});