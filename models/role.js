const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    _id: String,
    name: { type: String, unique: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const RoleModel = mongoose.model('Role', roleSchema);

module.exports = RoleModel;
