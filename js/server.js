const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware 
app.use(cors());
app.use(bodyParser.json());

// Endpoint to save records
app.post('/save', (req, res) => {
    const data = req.body;
    fs.writeFileSync('records.json', JSON.stringify(data));
    res.status(200).json({message : 'Data saved successfully'});
});

// Endpoint to load records
app.get('/load', (req, res) => {
    const data = JSON.parse(fs.readFileSync('records.json', 'utf8'));
    res.status(200).json(data);
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});