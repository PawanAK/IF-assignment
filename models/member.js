const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    _id: String,
    community: { type: String, ref: 'Community' },
    user: { type: String, ref: 'User' },
    role: { type: String, ref: 'Role' },
    created_at: { type: Date, default: Date.now },
});

const MemberModel = mongoose.model('Member', memberSchema);

module.exports = MemberModel;
