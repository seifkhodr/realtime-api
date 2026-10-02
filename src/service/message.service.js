import Message from '../model/message.model.js';
import Conversation from '../model/conversation.model.js';
import { ForbiddenError } from '../utils/AppError.js';
import {
    getPaginationParams,
    createPaginationMeta
} from '../utils/pagination.utils.js';

const createMessage = async (conversationId,sender,content)=>{
    await validateMembership(conversationId,sender);

    const createdMessage = new Message({conversationId,sender,content});
    await createdMessage.save();

    await updateLastMessage(conversationId,createdMessage._id);

    return createdMessage;
};

const getConversationMessages = async (conversationId, userId, query = {}) => {
    await validateMembership(conversationId,userId);

    const { page, limit } = getPaginationParams(query);
    const filter = { conversationId };
    const skip = (page - 1) * limit;

    const [messages, totalMessageCount] = await Promise.all([
        Message.find(filter)
            .populate({
                path: 'sender',
                select: 'firstName lastName'
            })
            .sort({ createdAt: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec(),
        Message.countDocuments(filter).exec()
    ]);

    return {
        data: messages,
        pagination: createPaginationMeta(page, limit, totalMessageCount)
    };
};

const validateMembership = async (conversationId,userId)=>{
    const membershipRecord = await Conversation.findOne(
        {
            _id : conversationId,
            participants : userId
        },
    );
    if(!membershipRecord)
        throw new ForbiddenError('You are not a participant in this conversation');

    return true;
};

const updateLastMessage = async (conversationId,messageId)=>{
    const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage : messageId
        }
    );
    return updatedConversation;
};


export default {
    createMessage,
    getConversationMessages
}