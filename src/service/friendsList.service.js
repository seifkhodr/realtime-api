import friendsList from "../model/friendsList.model.js";
// import {} from "../utils/AppError"; 

const addFriend =async (userId,friendId)=>{
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
                select  : '-_id -createAt -updatedAt -lastSeen -avatar +email +lastName +firstName' // for now only
            }
        )

    return res;
}


export default {
    addFriend,
    getFriends,
    removeFriend
}