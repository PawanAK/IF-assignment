const jwt = require('jsonwebtoken');
const { your_secret_key } = process.env.SECRET;

const authMiddleware = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization;

        // Check if the token is present
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, your_secret_key);

        // Attach the user information to the request object
        req.user = {
            userId: decodedToken.userId,
            // Add more user details if needed
        };

        // Proceed to the next middleware or route handler
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
