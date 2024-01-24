const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    _id: String,
    name: String,
    slug: { type: String, unique: true },
    owner: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const CommunityModel = mongoose.model('Community', communitySchema);

module.exports = CommunityModel;
