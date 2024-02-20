const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    mail: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
    admin: { type: Boolean },
    friends: [{ type: Schema.Types.Object, ref: 'User' }]
});

module.exports = mongoose.model("User", userSchema);