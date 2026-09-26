const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword){
    //generate salte
    const saltRounds = 10;
    const generatedSalt = await bcrypt.genSalt(saltRounds);

    //generate hash
    const hash = await bcrypt.hash(plainTextPassword,generatedSalt);
    
    return hash; // save this in db 
}

async function comparePasswords(plainTextPassword , hashPassword){
    // compate both password returned result is true if matched false if not
    const match = await bcrypt.compare(plainTextPassword,hashPassword);
    return match;
}

module.exports={
    hashPassword,
    comparePasswords
}