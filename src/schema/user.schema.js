import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({

    firstName : {
        type : String,
        required : [true, 'First Name is required'],
        trim : true,
        minlength : [3, 'First Name must be at least 2 characters long'],
        maxlength : [30, 'First Name cannot exceed 50 characters']
    },
    lastName : {
        type : String ,
        required : [true , 'Last Name is required'],
        trim : true ,
        minlength : [3, 'Last Name must be at least 2 characters long'],
        maxlength : [30, 'Last Name cannot exceed 50 characters']
    },
    age : {
        type : Number ,
        required : [true , 'Age is required'],

    },
    email : {
        type : String,
        required : [true, 'Email is required'],
        unique : true,
        lowercase : true,
        trim : true,
        validate : {
            validator: validator.isEmail,
            message: 'Please provide a valid email address',
        },
        index : true,
    },
    password: {
        type : String,
        required : [true, 'Password is required'],
        minlength : [8, 'Password must be at least 8 characters long'],
        select : false,
    },
    avatar: {
        type : String,
        default : '',
        trim : true,
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    lastSeen: {
        type : Date,
        default : Date.now,
    },
},
    {
    timestamps: true,
    versionKey: false,
    toJSON : {virtuals : true} ,
    toObject : {virtuals : true} ,
    strict : true
    }
);

userSchema.virtual('fullName').get(function(){

    return this.firstName.concat(' ' ,this.lastName);
    
});

userSchema.static('findByEmail' ,function(email){
    return this.findOne(
        {
            email : {$eq : email}
        }  
    )
});

userSchema.set('toJSON' ,{
    virtuals : true ,
    transform : function(doc,ret,options){
        delete ret.password;
        return ret ;
    }
});



export default userSchema;