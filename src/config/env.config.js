require('dotenv').config();

const getEnv = (key ,defaultKey)=>{
    const value = process.env[key];

    if(!value && !defaultKey)
        null; // handle this later

    return value || defaultKey;
}

module.exports = getEnv;