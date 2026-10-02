const allowedFields = {
    authFields : {
        register : [ 'firstName' , 'lastName' , 'age' , 'email' , 'password' , 'avatar' ],
        login : ['email' , 'password']
    },
    conversationFields : {
        create : ['type', 'name', 'participants'],
        addParticipant : ['participantId']
    },
    messageFields : {
        create : ['conversationId', 'content']
    },
    userField :{
        updateProfile : []
    },
    //other domain 
};

export default allowedFields;