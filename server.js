const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// This line is the "Bridge" that connects your OPD/Lab HTML files to the internet
app.use(express.static(path.join(__dirname, 'public')));

// --- MONGODB CONNECTION ---
const mongoURI = "mongodb+srv://jayachander089:jayachander089@cluster0.p7qf8.mongodb.net/SRR_Hospital?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Successfully Connected to MongoDB ATLAS (Cloud)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- THE HOME SCREEN ---
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f7f6; height: 100vh;">
            <h1 style="color: #2c3e50; font-size: 2.5rem;">Sri Raja Rajeshwari Hospital</h1>
            <p style="color: #27ae60; font-size: 1.2rem; font-weight: bold;">✔ System Status: Online & Cloud Connected</p>
            <hr style="width: 50%; margin: 30px auto; border: 1px solid #ddd;">
            
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: 30px;">
                <a href="/opd.html" style="text-decoration: none; background: #3498db; color: white; padding: 15px 40px; border-radius: 8px; width: 200px; font-weight: bold;">OPD REGISTRATION</a>
                <a href="/lab.html" style="text-decoration: none; background: #9b59b6; color: white; padding: 15px 40px; border-radius: 8px; width: 200px; font-weight: bold;">LABORATORY</a>
                <a href="/billing.html" style="text-decoration: none; background: #e67e22; color: white; padding: 15px 40px; border-radius: 8px; width: 200px; font-weight: bold;">BILLING</a>
            </div>

            <p style="margin-top: 50px; color: #7f8c8d; font-size: 0.9rem;">Hospital Administrator: Dr. Jayachander</p>
        </div>
    `);
});

// --- API ROUTES (For saving patient data) ---
// Add your patient registration and lab data routes below this line

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🏥 Sri Raja Rajeshwari Hospital System is LIVE`);
});