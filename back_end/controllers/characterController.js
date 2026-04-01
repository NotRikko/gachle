const Character = require('../models/character');
const DailyCharacter = require('../models/dailyCharacter');
const asyncHandler = require('express-async-handler');

exports.character_get_all = asyncHandler(async (req, res, next) => {
    const characters = await Character.find({});
    if(!characters) {
        return res.status(404).json({ message: 'No characters found' });
    }
    return res.status(200).json(characters);
});

exports.character_get_daily = asyncHandler(async (req, res, next) => {
    const today = new Date().toISOString().split('T')[0]; 

    const dailyCharacter = await DailyCharacter.findOne({ date: today }).populate('character');
    if(!dailyCharacter) {
        return res.status(404).json({ message: 'No daily character set for today' });
    }
    return res.status(200).json(dailyCharacter.character);
});

exports.character_post = asyncHandler(async (req, res, next) => {
    const { name, image, game, gender, hair_color } = req.body;

    if(!name || !image || !game || !gender || !hair_color) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingCharacter = await Character.findOne({ name });
    if(existingCharacter) {
        return res.status(400).json({ message: 'Character already exists' });
    }

    const character = new Character({ name, image, game, gender, hair_color });
    await character.save();
    return res.status(201).json(character);
});

exports.character_post_daily = asyncHandler(async (req, res, next) => {
    const { characterId, date } = req.body;

    if(!characterId || !date) {
        return res.status(400).json({ message: 'characterId and date are required' });
    }

    const character = await Character.findById(characterId);
    if(!character) {
        return res.status(404).json({ message: 'Character not found' });
    }

    const existing = await DailyCharacter.findOne({ date });
    if(existing) {
        return res.status(400).json({ message: `Daily character already set for ${date}` });
    }

    const dailyCharacter = new DailyCharacter({ character: characterId, date });
    await dailyCharacter.save();
    return res.status(201).json(dailyCharacter);
});