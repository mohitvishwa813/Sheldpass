const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    platfromusernameOrEmail: {
        type: String,
        required: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        trim: true
    },
    websiteUrl: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    email: { // This is the owner's email for filtering
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'Datastore' }); // Based on the user's screenshot

module.exports = mongoose.model('Credential', credentialSchema);
