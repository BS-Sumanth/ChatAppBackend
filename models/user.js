const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    mail: { type: String, unique: true },
    username: { type: String },
    password: { type: String },
    admin: { type: Boolean },
    friends: [{ type: Schema.Types.Object, ref: 'User' }],
    verified: { type: Boolean },
    verificationToken: {type: String}
});

module.exports = mongoose.model("User", userSchema);