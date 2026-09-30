import mongoose from "mongoose";
import messageSchema from "../schema/message.schema.js";

const messageModel = mongoose.model('Message' , messageSchema);

export default messageModel;