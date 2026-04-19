const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to load the dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 HMS Server Ready`);
    console.log(`📡 Database: Google Sheets`);
});