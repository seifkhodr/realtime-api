import friendsList from "../model/friendsList.model.js";
import User from '../model/user.model.js';
import {
    BadRequestError,
    NotFoundError
} from '../utils/AppError.js';

const addFriend =async (userId,friendId)=>{
    if (String(userId) === String(friendId))
        throw new BadRequestError('You cannot add yourself as a friend');

    await ensureUserExists(friendId);

    const updatedFriendsList = await friendsList.findOneAndUpdate(
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
    return populateFriendsList(updatedFriendsList);
}

const removeFriend = async (userId,friendId)=>{
    await ensureUserExists(friendId);

    const updatedFriendsList = await friendsList.findOneAndUpdate(
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

    if (!updatedFriendsList)
        throw new NotFoundError('Friends list not found');

    return populateFriendsList(updatedFriendsList);
}

const getFriends = async (userId) => {    
    const friendsListDocument = await friendsList
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

    return friendsListDocument || { userId, friends: [] };
}

const ensureUserExists = async (userId) => {
    const referencedUser = await User.exists({ _id: userId });
    if (!referencedUser)
        throw new NotFoundError('Friend user not found');
};

const populateFriendsList = async (friendsListDocument) => {
    return friendsListDocument.populate({
        path: 'friends',
        select: 'firstName lastName email'
    });
};


export default {
    addFriend,
    getFriends,
    removeFriend
}