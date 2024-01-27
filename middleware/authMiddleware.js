// authMiddleware.js
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const your_secret_key = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decodedToken = jwt.verify(token, your_secret_key);

        req.user = {
            userId: decodedToken.userId,
        };

        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
