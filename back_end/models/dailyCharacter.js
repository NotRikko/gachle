const mongoose = require('mongoose');

const DailyCharacterSchema = new mongoose.Schema({
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true,
    },
    date: {
        type: String,   
        required: true,
        unique: true,
    }
})

module.exports = mongoose.model('DailyCharacter', DailyCharacterSchema);