import User from '../model/user.model.js';
import passwordUtils from '../utils/password.utils.js';

//recieved data is {fname,lname,email,password,avatar?}
async function createUser(data) {
    const exist = await User.findByEmail(data.email);
    if (exist) {
        //edit this when implement the apperror file
        throw new Error('confilct error');
    }

    //now hash password
    const hashPassword = await passwordUtils.hashPassword(data.password);

    //create user document
    const newUser = new User(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            email: data.email,
            password: hashPassword
        }
    );

    await newUser.save();

    return newUser.toJSON();

}

async function authenticateUser(data) {
    const user = await User.findByEmail(data.email).select('+password');
    // console.log(user)

    //unauthorized error
    if (!user)
        throw new Error('User not found');

    const match = await passwordUtils.comparePasswords(data.password, user.password);
    if (!match)
        throw new Error('Unauthorized error');

    return user.toJSON();
}

export default {
    createUser,
    authenticateUser
}


// note : later move the password things to the schema level using the mongoose middleware