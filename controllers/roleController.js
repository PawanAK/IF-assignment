const { Snowflake } = require("@theinternetfolks/snowflake");


const RoleModel = require('../models/role');

const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Create a new role
        const newRole = new RoleModel({
            _id: Snowflake.generate(),
            name,
        });

        await newRole.save();

        res.status(201).json({ message: 'Role created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createRole, getAllRoles };
