const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB configuration

//change url nitu your mongodb
const mongoURI = 'mongodb+srv://Subscriber-server:EB5VxyrCjLHO52Dy@cluster0.u675lb8.mongodb.net/subscriber-server?retryWrites=true&w=majority&appName=Cluster0'; // Change this to your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model for subscribers
const subscriberSchema = new mongoose.Schema({
    name: String,
    email: String, // Add email field
    password: String, // Add password field
    created_at: { type: Date, default: Date.now }
});

console.log(subscriberSchema)

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// CORS middleware to allow requests from all origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route to handle form submission
app.post('/subscribe', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newSubscriber = new Subscriber({ name, email, password }); // Include email and password
        await newSubscriber.save();
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Subscription failed: ' + err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
