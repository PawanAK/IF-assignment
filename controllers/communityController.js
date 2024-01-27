const CommunityModel = require('../models/community');
const UserModel = require('../models/user');

const createCommunity = async (req, res) => {
    try {
        const { name } = req.body;
        const ownerId = req.user.userId; // Assuming you have middleware that attaches user information

        // Check if the user exists
        const owner = await UserModel.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }

        // Create a new community
        const newCommunity = new CommunityModel({
            _id: Snowflake.generate(),
            name,
            owner: ownerId,
        });

        await newCommunity.save();

        res.status(201).json({ message: 'Community created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await CommunityModel.find();
        res.status(200).json(communities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createCommunity, getAllCommunities };
