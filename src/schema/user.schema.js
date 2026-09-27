import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address',
        },
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false,
    },
    avatar: {
        type: String,
        default: '',
        trim: true,
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
},
    {
    timestamps: true,
    versionKey: false,
    }
);


// userSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     delete ret.password;
//     return ret;
//   },
// });


export default userSchema;