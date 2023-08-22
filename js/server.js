const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/records', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err));


// Define schema for records
const recordSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    desc: String,
    color: String,
    url: String,
    isMarked: Boolean
});

// Define model for records
const Record = mongoose.model('Record', recordSchema);

// Endpoint to save records to MongoDB
app.post('/saveToDB', async (req, res) => {
    const newRecord = new Record(req.body);
    const savedRecord = await newRecord.save();
    res.status(200).json(savedRecord);
    console.log('Data saved successfully');
});

// Endpoint to load records from MongoDB
app.get('/loadFromDB', async (req, res) => {
    const records = await Record.find();
    res.status(200).json(records);
    console.log('Data loading');
});

// Endpoint to save records
app.post('/saveToFile', (req, res) => {
    const data = req.body;
    fs.writeFileSync('records.json', JSON.stringify(data));
    res.status(200).json({message : 'Data saved successfully'});
});

// Endpoint to load records
app.get('/loadToFile', (req, res) => {
    const data = JSON.parse(fs.readFileSync('records.json', 'utf8'));
    res.status(200).json(data);
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});