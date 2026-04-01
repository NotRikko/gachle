const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    game: {
        type: String,
        required: true,
        enum: ['Genshin Impact', 'Honkai: Star Rail', 'Zenless Zone Zero'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    hair_color: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Character', CharacterSchema);