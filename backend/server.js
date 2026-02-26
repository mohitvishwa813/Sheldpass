require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Credential = require('./models/Credential');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
        req.user = user;
        next();
    });
};

// --- Auth Routes ---

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[DEBUG] Registration attempt for: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`[DEBUG] Registration failed: User ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        console.log(`[DEBUG] User registered successfully: ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('[DEBUG] Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[DEBUG] Login attempt for: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`[DEBUG] No user found with email: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`[DEBUG] User found. Checking password...`);
        const isMatch = await user.comparePassword(password);
        console.log(`[DEBUG] Password match result: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        console.error('[DEBUG] Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// --- Credential Routes ---

// Get all credentials for the logged-in user
app.get('/api/credentials', authenticateToken, async (req, res) => {
    try {
        const credentials = await Credential.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.json(credentials);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching credentials' });
    }
});

// Add a new credential
app.post('/api/credentials', authenticateToken, async (req, res) => {
    try {
        const { platfromusernameOrEmail, platform, websiteUrl, password, description } = req.body;
        const newCred = new Credential({
            platfromusernameOrEmail,
            platform,
            websiteUrl,
            password,
            description,
            email: req.user.email
        });
        await newCred.save();
        res.status(201).json(newCred);
    } catch (err) {
        res.status(500).json({ message: 'Error adding credential' });
    }
});

// Update a credential
app.put('/api/credentials/:id', authenticateToken, async (req, res) => {
    try {
        const { platfromusernameOrEmail, platform, websiteUrl, password, description } = req.body;
        const updatedCred = await Credential.findOneAndUpdate(
            { _id: req.params.id, email: req.user.email },
            { platfromusernameOrEmail, platform, websiteUrl, password, description },
            { new: true }
        );
        if (!updatedCred) return res.status(404).json({ message: 'Credential not found' });
        res.json(updatedCred);
    } catch (err) {
        res.status(500).json({ message: 'Error updating credential' });
    }
});

// Delete a credential
app.delete('/api/credentials/:id', authenticateToken, async (req, res) => {
    try {
        const deletedCred = await Credential.findOneAndDelete({ _id: req.params.id, email: req.user.email });
        if (!deletedCred) return res.status(404).json({ message: 'Credential not found' });
        res.json({ message: 'Credential deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting credential' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
