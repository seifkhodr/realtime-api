import mongoose from "mongoose";
import friendsListSchema from '../schema/friendsList.schema.js';

const friendsListModel = mongoose.model('friendsList' ,friendsListSchema);

export default friendsListModel;