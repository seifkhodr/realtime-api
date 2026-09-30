import Conversation from '../model/conversation.model.js';

const createConversation = async (userId,payload)=>{ 
    const {type,name,participants} = payload;

    validateConversationType(type,participants);

    const allParticipants = [...new Set([userId , ...participants]) ].map(String);
    
    if(type === 'direct'){
        const existingConversation = await findByParticipants(allParticipants);
        if(existingConversation)
            return existingConversation;
    }
    else{
        const conversation = new Conversation(
            {
                type,
                name: type === 'group' ? name : undefined,
                owner:userId ,
                participants : allParticipants
            }
        );

    }
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
            updateAt : -1
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
        throw new Error('Conversation not found');

    const belongsToConversation = conversation.participants.some(
        participant => userId === participant._id.toString()
    )
    if(!belongsToConversation)
        throw new Error('Unauthorized');

    return conversation;
};

const addParticipant = async (conversationId,userId,newParticipant) => {
    const conversation = await Conversation.findById(conversationId);
    if(!conversation)
        throw new Error('conversation not found');

    if(conversation.type === 'group')
        throw new Error('Cannot add members to direct chat');

    if(conversation.owner.toString() !== userId)
        throw new Error('Only Owner can add members');

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
        throw new Error('Conversation not found');

    if(conversation.owner.toString() !== userId)
        throw new Error('Only owner can remove members');

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

const validateConversationType = async (type,participants) => {
    const validType = ['direct' , 'group'];

    const isValid = validType.includes(type);
    if(!isValid)
        throw new Error('Invalid conversation type');

    if(type ==='direct' && participants.lenght!==2)
        throw new Error('Direct Conversation require at least one recipient')

    if(type ==='group' && participants.lenght<2)
        throw new Error('Groud Conversation require at least 2 participants')

};



export default {
    createConversation,
    removeParticipant,
    addParticipant,
    getConversationById,
    getConversations
}