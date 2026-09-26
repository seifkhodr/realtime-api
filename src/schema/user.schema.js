const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    socketId: { type: String, default: '' },
});


//hash password before saving the user

//compare password method

module.exports = mongoose.model('User', userSchema);