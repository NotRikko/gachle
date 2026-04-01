const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const cors = require('cors')
const User = require('./models/user')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const characterRouter = require('./routes/characterRouter');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const app = express();
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch(err) {
        return done(err, false);
    }
}));

passport.use(new LocalStrategy(async (user_name, password, done) => {
    try {
        const user = await User.findOne({ user_name });
        if (!user) return done(null, false, { message: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    } catch(err) {
        return done(err);
    }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/users', userRouter);
app.use('/characters', characterRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message });
});

module.exports = app;