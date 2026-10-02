import friendsList from "../model/friendsList.model.js";
import {
    BadRequestError,
    NotFoundError
} from '../utils/AppError.js';

const addFriend =async (userId,friendId)=>{
    if (userId === friendId)
        throw new BadRequestError('You cannot add yourself as a friend');

    const res = await friendsList.findOneAndUpdate(
        {
            userId : userId
        },
        {
            $addToSet :{
                friends: friendId
            }
        },
        {
            upsert : true,
            returnDocument : 'after'
        }
    );
    return res;
}

const removeFriend = async (userId,friendId)=>{
    const res = await friendsList.findOneAndUpdate(
        {
            userId : userId
        },
        {
            $pull : {
                friends : friendId
            }
        },
        {

            returnDocument : 'after'
        }
    );

    if (!res)
        throw new NotFoundError('Friends list not found');

    return res;
}

const getFriends = async (userId) => {    
    const res = await friendsList
        .findOne(
            {
                userId 
            }
        )
        .populate(
            {
                path : 'friends',
                select  : 'firstName lastName email' // BUG-FIX: was mixed exclusion/inclusion which MongoDB rejects
            }
        )

    return res;
}


export default {
    addFriend,
    getFriends,
    removeFriend
}