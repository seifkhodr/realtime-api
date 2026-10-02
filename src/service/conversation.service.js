import Conversation from '../model/conversation.model.js';
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError
} from '../utils/AppError.js';

const createConversation = async (userId, payload) => {
    const { type, name, participants } = payload;

    // BUG-FIX BUG-04: removed async (no async ops inside), BUG-03: lenght→length
    validateConversationType(type, participants);

    const allParticipants = [...new Set([userId, ...participants])].map(String);

    if (type === 'direct') {
        const existingConversation = await findByParticipants(allParticipants);
        if (existingConversation)
            return existingConversation;

        // BUG-FIX BUG-02: direct conversation was also never created — fall through to create below
    }

    // BUG-FIX BUG-02: group conversation was created but never saved or returned
    const conversation = new Conversation({
        type,
        name: type === 'group' ? name : undefined,
        owner: userId,
        participants: allParticipants
    });
    await conversation.save();
    return conversation;
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
            updatedAt: -1 // BUG-FIX BUG-09: was 'updateAt' (typo)
        }
    )
};

const getConversationById = async (conversationId,userId) => {
    const conversation = await Conversation.findById(
        conversationId
    )
    .populate(
        'participants'
    );
    if(!conversation)
        throw new NotFoundError('Conversation not found');

    const belongsToConversation = conversation.participants.some(
        participant => userId === participant._id.toString()
    )
    if(!belongsToConversation)
        throw new ForbiddenError('You are not a participant in this conversation');

    return conversation;
};

const addParticipant = async (conversationId,userId,newParticipant) => {
    const conversation = await Conversation.findById(conversationId);
    if(!conversation)
        throw new NotFoundError('Conversation not found');

    if(conversation.type === 'direct')
        throw new BadRequestError('Cannot add members to a direct conversation');

    if(conversation.owner.toString() !== userId)
        throw new ForbiddenError('Only the owner can add members');

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
    const conversation = await Conversation.findById(conversationId);
    if(!conversation)
        throw new NotFoundError('Conversation not found');

    if(conversation.owner.toString() !== userId)
        throw new ForbiddenError('Only the owner can remove members');

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

// BUG-FIX BUG-04: removed async (no async ops), BUG-03: lenght → length
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



export default {
    createConversation,
    removeParticipant,
    addParticipant,
    getConversationById,
    getConversations
}