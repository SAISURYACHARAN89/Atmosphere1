const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT and attach user to request
module.exports = async function auth(req, res, next) {
    try {
        let token = null;

        // Check Authorization header first
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        // Fallback to query param token (for browser downloads)
        if (!token && req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        next(err);
    }
};
