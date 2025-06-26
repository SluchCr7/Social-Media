const mongoose = require('mongoose');

const verificationToken = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenVer: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Verification = mongoose.model('Verification', verificationToken)

module.exports = Verification