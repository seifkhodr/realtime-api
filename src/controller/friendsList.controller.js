import friendsListService from '../service/friendsList.service.js';
import catchAsyncWrapper from "../middleware/catchAsyncWrapper.middleware.js";
import { httpResponseSuccessCode } from "../utils/enums/httpResponseStatusCode.js";
import { httpSuccessResponse } from "../utils/httpResponseFormatter.js";

const addFriend = catchAsyncWrapper(
    async (req,res,next)=>{
        const newFriend = await friendsListService.addFriend(
            req.user.id,
            req.params.friendId
        );

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(
                    newFriend
                )
            )
    
    }
);

const removeFriend = catchAsyncWrapper(
    async (req,res,next)=>{
        const deletedFriend = await friendsListService.removeFriend(
            req.user.id,
            req.params.friendId
        );

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(
                    deletedFriend
                )
            );
    }
);

const getFriends = catchAsyncWrapper(
    async (req,res,next)=>{
        const friendsList = await friendsListService.getFriends(req.user.id);

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(
                    friendsList
                )
            );
    }
);

export default {
    addFriend,
    removeFriend,
    getFriends
}