const passport = require('passport')
const asyncHandler = require('express-async-handler')

const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        next();
    })(req, res, next);
}

const isAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        if (!user.admin) return res.status(403).json({ message: 'Admin access required' });
        req.user = user;
        next();
    })(req, res, next);
}

module.exports = { authenticateJWT, isAdmin };