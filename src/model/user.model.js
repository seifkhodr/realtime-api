import mongoose from 'mongoose';
const { model } = mongoose;
import userSchema from '../schema/user.schema.js';

const UserModel = model('User', userSchema);

export default UserModel;