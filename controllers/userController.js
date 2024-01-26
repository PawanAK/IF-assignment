const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const UserModel = require('../models/user');

const UserController = {
    signup: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Validate inputs
            if (!validator.isEmail(email) || !validator.isStrongPassword(password)) {
                return res.status(400).json({ error: 'Invalid email or password formats' });
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
                _id: generateSnowflakeId(), // Replace with your snowflake ID generation logic
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    signin: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate inputs
            if (!validator.isEmail(email) || !validator.isStrongPassword(password)) {
                return res.status(400).json({ error: 'Invalid email or password format' });
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
            const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getMe: async (req, res) => {
        try {
            // Assuming you have middleware that attaches the user information to the request object
            const { userId } = req.user;
            const user = await UserModel.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = UserController;
