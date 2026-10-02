import Conversation from '../model/conversation.model.js';
import User from '../model/user.model.js';
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError
} from '../utils/AppError.js';

const createConversation = async (userId, payload) => {
    const { type, name, participants } = payload;

    validateConversationType(type, participants);

    const participantIds = participants.map(String);
    const uniqueParticipantIds = [...new Set(participantIds)];

    if (uniqueParticipantIds.length !== participantIds.length)
        throw new BadRequestError('Participants must be unique');

    if (uniqueParticipantIds.includes(String(userId)))
        throw new BadRequestError('You cannot add yourself to the conversation');

    const allParticipants = [String(userId), ...uniqueParticipantIds];
    await ensureUsersExist(allParticipants);

    if (type === 'direct') {
        const existingConversation = await findByParticipants(allParticipants);
        
        if (existingConversation)
            return existingConversation;

    }

    const newConversation = new Conversation({
        type,
        name: type === 'group' ? name : undefined,
        owner: userId,
        participants: allParticipants
    });

    await newConversation.save();
    
    return newConversation;
};

export const findByParticipants = async (participants) => {
    return Conversation.findOne({
        type: "direct",
        participants: {
            $all: participants
        },
        $expr: {
            $eq: [
                {
                    $size:
                        "$participants"
                },
                participants.length
            ]
        }
    });
};


const getConversations = async (userId)=>{
    return Conversation.find(
        {
            participants : userId
        }
    )
    .populate(
        {
            path : 'participants',
            select : 'firstName lastName email'
        }
    )
    .populate(
        {
            path: 'owner',
            select : 'firstName lastName'
        }
    )
    .sort(
        {
                updatedAt: -1
        }
    )
};

const getConversationById = async (conversationId,userId) => {
    const conversationRecord = await Conversation.findById(
        conversationId
    )
    .populate(
        'participants'
    );
    if(!conversationRecord)
        throw new NotFoundError('Conversation not found');

    const belongsToConversation = conversationRecord.participants.some(
        participant => participant && userId === participant._id.toString()
    )
    if(!belongsToConversation)
        throw new ForbiddenError('You are not a participant in this conversation');

    return conversationRecord;
};

const addParticipant = async (conversationId,userId,newParticipant) => {
    const conversationRecord = await Conversation.findById(conversationId);
    if(!conversationRecord)
        throw new NotFoundError('Conversation not found');

    if(conversationRecord.type === 'direct')
        throw new BadRequestError('Cannot add members to a direct conversation');

    if(conversationRecord.owner.toString() !== userId)
        throw new ForbiddenError('Only the owner can add members');

    await ensureUsersExist([newParticipant]);

    return Conversation.findByIdAndUpdate(
        conversationId,
        {
            $addToSet : {
                participants : newParticipant
            }
        },
        {
            returnDocument : 'after'
        }
    )
}

const removeParticipant= async (conversationId , userId , participantId) => {
    const conversationRecord = await Conversation.findById(conversationId);
    if(!conversationRecord)
        throw new NotFoundError('Conversation not found');

    if(conversationRecord.owner.toString() !== userId)
        throw new ForbiddenError('Only the owner can remove members');

    if (conversationRecord.type === 'direct')
        throw new BadRequestError('Direct conversations do not have removable participants');

    if (conversationRecord.owner.toString() === participantId)
        throw new BadRequestError('The conversation owner cannot be removed');

    if (conversationRecord.participants.length <= 2)
        throw new BadRequestError('A group must have at least two participants');

    if (!conversationRecord.participants.some(
        participant => participant.toString() === participantId
    ))
        throw new NotFoundError('Participant not found in conversation');

    return Conversation.findByIdAndUpdate(
        conversationId,
        {
            $pull : {
                participants : participantId
            }
        },
        {
            returnDocument : 'after'
        }
    );
}

const validateConversationType = (type, participants) => {
    const validType = ['direct', 'group'];

    if (!validType.includes(type))
        throw new BadRequestError('Invalid conversation type, must be "direct" or "group"');

    if (!Array.isArray(participants))
        throw new BadRequestError('Participants must be an array');

    if (type === 'direct' && participants.length !== 1)
        throw new BadRequestError('Direct conversation requires exactly one recipient');

    if (type === 'group' && participants.length < 2)
        throw new BadRequestError('Group conversation requires at least 2 participants');
};

const ensureUsersExist = async (userIds) => {
    const users = await User.find({
        _id: { $in: userIds }
    })
        .select('_id')
        .lean();

    if (users.length !== userIds.length)
        throw new NotFoundError('One or more referenced users were not found');
};



export default {
    createConversation,
    removeParticipant,
    addParticipant,
    getConversationById,
    getConversations
}