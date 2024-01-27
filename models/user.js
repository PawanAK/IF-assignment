const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String, // Assuming you generate Snowflake IDs as strings
    name: { type: String, default: null },
    email: { type: String, unique: true },
    password: String,
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);


