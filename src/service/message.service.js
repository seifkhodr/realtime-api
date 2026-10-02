import Message from '../model/message.model.js';
import Conversation from '../model/conversation.model.js';
import { ForbiddenError } from '../utils/AppError.js';

const createMessage = async (conversationId,sender,content)=>{
    await validateMembership(conversationId,sender);

    const message = new Message({conversationId,sender,content});
    await message.save();

    await updateLastMessage(conversationId,message._id);

    return message;
};

const getConversationMessages =async (conversationId ,userId)=>{
    await validateMembership(conversationId,userId);

    return Message.find(
        {
            conversationId
        }
    )
    .populate({
        path : "sender",
        select : "firstName lastName"
    })
    .sort({
        createAt : 1
    })
};

const validateMembership = async (conversationId,userId)=>{
    const isMember = await Conversation.findOne(
        {
            _id : conversationId,
            participants : userId
        },
    );
    if(!isMember)
        throw new ForbiddenError('You are not a participant in this conversation');

    return true;
};

const updateLastMessage = async (conversationId,messageId)=>{
    const res = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage : messageId
        }
    );
    return res;
};


export default {
    createMessage,
    getConversationMessages
}