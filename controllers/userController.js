const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Snowflake } = require("@theinternetfolks/snowflake");
const Validator = require('validatorjs');
const UserModel = require('../models/user');

const your_secret_key = process.env.SECRET;

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation rules
        const rules = {
            name: 'required|string|min:2',
            email: 'required|email',
            password: 'required|min:6'
        };

        // Validator instance
        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            // Validation failed, return error messages
            return res.status(400).json({ error: validation.errors.all() });
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

        // Validation rules for signin
        const rules = {
            email: 'required|email',
            password: 'required|min:6'
        };

        // Validator instance
        const validation = new Validator(req.body, rules);

        if (validation.fails()) {
            // Validation failed, return error messages
            return res.status(400).json({ error: validation.errors.all() });
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
        // Assuming you have middleware that attaches the user information to the request object
        const { userId } = req.user;

        // Retrieve user details from the database
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user details in the response
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { signup, signin, getMe };
