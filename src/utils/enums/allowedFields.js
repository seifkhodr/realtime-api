const allowedFields = {
    authFields : {
        register : [ 'firstName' , 'lastName' , 'age' , 'email' , 'password' , 'avatar' ],
        login : ['email' , 'password']
    },
    userField :{
        updateProfile : []
    },
    //other domain 
};

export default allowedFields;