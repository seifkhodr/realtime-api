import mongoose from "mongoose";

const friendsListSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        friends : {
            required : true,
            type : [
                {
                    type : mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        }
    }
);
/**
 * friends

is an array

every element

is a User reference
 */

export default friendsListSchema;