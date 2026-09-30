import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Conversation' ,
            required : true ,
            index : true
        },
        sender: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        content : {
            type : String ,
            required : true ,
            trim : true,
            maxLength : [300 , 'message cannot exceed 300 character']
        }
    },
    {
        timestamps : true
    }
);

export default messageSchema;