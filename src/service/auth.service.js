import User from '../model/user.model.js';
import passwordUtils from '../utils/password.utils.js';
import {
    ConflictError,
    UnauthorizedError
} from '../utils/AppError.js';

//recieved data is {fname,lname,email,password,avatar?}
async function createUser(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
        throw new ConflictError('An account with this email already exists');
    }

    //now hash password
    const hashedPassword = await passwordUtils.hashPassword(userData.password);

    //create user document
    const newUser = new User(
        {
            firstName: userData.firstName,
            lastName: userData.lastName,
            age: userData.age,
            email: userData.email,
            password: hashedPassword
        }
    );

    await newUser.save();

    return newUser.toJSON();

}

async function authenticateUser(credentials) {
    const authenticatedUser = await User.findByEmail(credentials.email).select('+password');
    // console.log(user)

    //unauthorized error
    if (!authenticatedUser)
        throw new UnauthorizedError('Invalid email or password');

    const passwordMatches = await passwordUtils.comparePasswords(credentials.password, authenticatedUser.password);
    if (!passwordMatches)
        throw new UnauthorizedError('Invalid email or password');

    return authenticatedUser.toJSON();
}

export default {
    createUser,
    authenticateUser
}


// note : later move the password things to the schema level using the mongoose middleware