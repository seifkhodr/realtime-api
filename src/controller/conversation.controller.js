import conversationService from '../service/conversation.service.js';
import catchAsyncWrapper from "../middleware/catchAsyncWrapper.middleware.js";
import {httpResponseSuccessCode} from "../utils/enums/httpResponseStatusCode.js";
import {httpSuccessResponse} from "../utils/httpResponseFormatter.js";

const createConversation = catchAsyncWrapper(
    async (req,res,next)=>{
        const createdConversation = await conversationService.createConversation(
            req.user.id,
            req.data
        );

        return res
            .status(
                httpResponseSuccessCode.CREATED
            )
            .json(
                httpSuccessResponse(createdConversation)
            );
    }  
);

// const deleteConversation = catchAsyncWrapper(
//     async (req,res,next)=>{
//         const deletedConversation = await conversationService.deletedConversation(req.params.conversationId);

//         /**
//          * conversationId as params from the route
//          */
//         return res
//             .status(
//                 httpResponseSuccessCode.OK
//             )
//             .json(
//                 httpSuccessResponse(
//                     deletedConversation
//                 )
//             )
//     }
// );

const getConversations= catchAsyncWrapper(
    async (req,res,next)=>{
        /**
         * get conv for the user that is auth
         * req.user.id
         */
        const conversations = await conversationService.getConversations(req.user.id);
        
        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(conversations)
            )

    }
);

const getConversationById = catchAsyncWrapper(
    async (req,res,next)=>{
        const conversationDetails = await conversationService.getConversationById(req.params.conversationId,req.user.id);

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(conversationDetails)
            )
    }
);

// only work if type =='groud' and user == owner
const addParticipant = catchAsyncWrapper(
    async (req,res,next)=>{
        const participants = await conversationService.addParticipant(
            req.params.conversationId,
            req.user.id,
            req.data.participantId
        );

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(participants)
            )
        }
);

// only work if type =='groud' and user == owner
const removeParticipant = catchAsyncWrapper(
    async (req,res,next)=>{
        const participants = await conversationService.removeParticipant(
            req.params.conversationId,
            req.user.id,
            req.params.participantId
        )

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(participants)
            )
    }
);

export default {
    createConversation,
    // deleteConversation,
    getConversations,
    getConversationById,
    addParticipant,
    removeParticipant
};