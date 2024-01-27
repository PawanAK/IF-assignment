const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Snowflake } = require("@theinternetfolks/snowflake");
const Validator = require('validatorjs');
const UserModel = require('../models/user');

const your_secret_key = process.env.SECRET;

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate inputs
        const validationRules = {
            name: 'required|min:2',
            email: 'required|email',
            password: 'required|min:6',
        };

        const validation = new Validator({ name, email, password }, validationRules);

        if (validation.fails()) {
            return res.status(400).json({ error: 'Invalid input format', details: validation.errors.all() });
        }

        // Check if user with the same email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
            _id: Snowflake.generate(),
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate and send a JWT token for immediate signin
        const token = jwt.sign({ userId: newUser._id }, your_secret_key, { expiresIn: '1h' });

        // Return the access token in the response
        res.status(201).json({ meta: { access_token: token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        const validationRules = {
            email: 'required|email',
            password: 'required|min:6',
        };

        const validation = new Validator({ email, password }, validationRules);

        if (validation.fails()) {
            return res.status(400).json({ error: 'Invalid input format', details: validation.errors.all() });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate and send a JWT token
        const token = jwt.sign({ userId: user._id }, your_secret_key, { expiresIn: '1h' });

        // Return the access token in the response
        res.status(200).json({ meta: { access_token: token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMe = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;

        // Check if the token is present and properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        }

        // Extract the token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        // Verify the token
        const decodedToken = jwt.verify(token, your_secret_key);

        // Retrieve user details from the database
        const user = await UserModel.findById(decodedToken.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user details in the response
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { signup, signin, getMe };
