const { Snowflake } = require("@theinternetfolks/snowflake");


const MemberModel = require('../models/member');
const UserModel = require('../models/user');
const CommunityModel = require('../models/community');
const RoleModel = require('../models/role');

const addMember = async (req, res) => {
    try {
        const { communityId, userId, roleId } = req.body;

        // Check if the user and community exist
        const user = await UserModel.findById(userId);
        const community = await CommunityModel.findById(communityId);

        if (!user || !community) {
            return res.status(404).json({ error: 'User or Community not found' });
        }

        // Check if the role exists
        const role = await RoleModel.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Add a new member
        const newMember = new MemberModel({
            _id: Snowflake.generate(),
            community: communityId,
            user: userId,
            role: roleId,
        });

        await newMember.save();

        res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const removeMember = async (req, res) => {
    try {
        const memberId = req.params.id;

        // Check if the member exists
        const member = await MemberModel.findById(memberId);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Remove the member
        await member.remove();

        res.status(200).json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { addMember, removeMember };
