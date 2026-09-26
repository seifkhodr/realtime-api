const mongoose = require('mongoose');
const { model } = mongoose;
const userSchema = require('../schema/user.schema');

const UserModel = model('User', userSchema);

module.exports = UserModel;