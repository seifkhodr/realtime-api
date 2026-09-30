import conversationService from '';
import catchAsyncWrapper from "../middleware/catchAsyncWrapper.middleware";
import {httpResponseSuccessCode} from "../utils/enums/httpResponseStatusCode";
import {httpSuccessResponse} from "../utils/httpResponseFormatter";

const createConversation = catchAsyncWrapper(
    async (req,res,next)=>{
        const conversation = await conversationService.createConversation(
            req.user.id,
            req.data
        );
        /**
         * user must be auth so req.user
         * the request is post pass the isAllowedField so sanitize
         * data object : {
         *  type : 'direct/group',
         *  ownerId : 'same as req.user.id',
         *  name : is optional is direct same name as the friend
         *  practicpants : user.id , practicipants in data object
         *  last messafe null for now 
         * }
         */

        return res
            .status(
                httpResponseSuccessCode.CREATED
            )
            .json(
                httpSuccessResponse(conversation)
            );
    }  
);

const deleteConversation = catchAsyncWrapper(
    async (req,res,next)=>{
        const deletedConversation = await conversationService.deleteConversation();

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(
                    deletedConversation
                )
            )
    }
);

const getConversationByUserId = catchAsyncWrapper(
    async (req,res,next)=>{

    }
);

const getConversationById = catchAsyncWrapper(
    async (req,res,next)=>{

    }
);

// only work if type =='groud' and user == owner
const addParticipants = catchAsyncWrapper(
    async (req,res,next)=>{

    }
);

// only work if type =='groud' and user == owner
const removeParticipants = catchAsyncWrapper(
    async (req,res,next)=>{

    }
);

export default {
    createConversation,
    deleteConversation,
    getConversationByUserId,
    getConversationById,
    addParticipants,
    removeParticipants
};