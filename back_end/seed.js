require('dotenv').config();
const mongoose = require('mongoose');
const Character = require('./models/character');
const DailyCharacter = require('./models/dailyCharacter');

const characters = [
    {
        name: 'Raiden Shogun',
        image: 'https://4kwallpapers.com/images/wallpapers/raiden-shogun-2048x2048-14781.jpg',
        game: 'Genshin Impact',
        gender: 'Female',
        hair_color: 'Purple',
    },
    {
        name: 'Hu Tao',
        image: 'https://pbs.twimg.com/media/EwTbmNeWYAIROmu.jpg',
        game: 'Genshin Impact',
        gender: 'Female',
        hair_color: 'Brown',
    },
    {
        name: 'Kafka',
        image: 'https://pbs.twimg.com/media/GGRZMN_WAAAlFla.jpg',
        game: 'Honkai: Star Rail',
        gender: 'Female',
        hair_color: 'Purple',
    },
    {
        name: 'Blade',
        image: 'https://i.redd.it/dlx8pzrq6z6c1.jpeg',
        game: 'Honkai: Star Rail',
        gender: 'Male',
        hair_color: 'Black',
    },
    {
        name: 'Vivian',
        image: 'https://i.pinimg.com/736x/f5/50/ba/f550ba10909ae55e9f5b2b5294737ed2.jpg',
        game: 'Zenless Zone Zero',
        gender: 'Female',
        hair_color: 'Purple',
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        await Character.deleteMany({});
        await DailyCharacter.deleteMany({});
        console.log('Cleared existing characters');

        const insertedCharacters = await Character.insertMany(characters);
        console.log(`Inserted ${insertedCharacters.length} characters`);

        const today = new Date().toISOString().split('T')[0];
        await DailyCharacter.create({
            character: insertedCharacters[0]._id,
            date: today,
        });
        console.log(`Daily character set to ${insertedCharacters[0].name} for ${today}`);

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
}

seed();