const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    high_score: {
        type: Number,
        required: false,
        min: 0,
    },
    admin: {
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('User', UserSchema);