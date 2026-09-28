import bcrypt from 'bcrypt';

//hash the password and return the hash to be stored in the database
async function hashPassword(plainTextPassword) {
    //generate salte
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);

    //generate hash
    const hash = await bcrypt.hash(plainTextPassword, generatedSalt);

    return hash; // save this in db 
}

//compare the plain text password with the hash password stored in the database
async function comparePasswords(plainTextPassword, hashPassword) {
    // compate both password returned result is true if matched false if not
    const match = await bcrypt.compare(plainTextPassword, hashPassword);
    return match;
}

export default {
    hashPassword,
    comparePasswords
}