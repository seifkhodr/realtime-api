import mongoose from "mongoose";

const Schema  = mongoose.Schema;

const converstationSchema = new Schema(
    {
        type : {
            type : String,
            enum: ["direct", "group"],
            required : [true , "Conversation type is required"],
        },
        name : {
            type : String,
            required : false,
            trim : true,
            maxlength: 100,
            default: null
        },
        owner : {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : [true, 'Owner id is required']
        },

        participants:{
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            required : [true , "Participants are required"],
        },
        lastMessage : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Message',
            default : null
        }
    },{
        timestamps: true
    }
);

export default converstationSchema;