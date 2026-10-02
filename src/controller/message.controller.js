//send / get message

import messageService from '../service/message.service.js';
import catchAsyncWrapper from "../middleware/catchAsyncWrapper.middleware.js";
import {httpResponseSuccessCode} from "../utils/enums/httpResponseStatusCode.js";
import {httpSuccessResponse} from "../utils/httpResponseFormatter.js";


const sendMessage = catchAsyncWrapper(
    async (req,res,next)=>{
        const createdMessage = await messageService.createMessage(
            req.data.conversationId,
            req.user.id,
            req.data.content
        );

        return res
            .status(
                httpResponseSuccessCode.CREATED
            )
            .json(
                httpSuccessResponse(
                    createdMessage
                )
            );
    }
);

const getMessages = catchAsyncWrapper(
    async (req,res,next) => {
        const paginatedMessages = await messageService.getConversationMessages(
            req.params.conversationId,
            req.user.id,
            req.query
        );

        return res
            .status(
                httpResponseSuccessCode.OK
            )
            .json(
                httpSuccessResponse(
                    paginatedMessages
                )
            )
    }
);

export default {
    sendMessage,
    getMessages
}