import getEnv from './env.config.js';
import mongoose from 'mongoose';

class DbConnection {
    constructor(){
        this.mongoose = mongoose;
    }

    async connect(){
        try {
            const MONGODB_URI = "mongodb+srv://"
                .concat(
                    encodeURIComponent(getEnv('MONGODB_USERNAME' , null)) ,
                    ':',
                    encodeURIComponent(getEnv('MONGODB_PASSWORD' , null)),
                    '@',
                    getEnv('MONGODB_CLUSTER', null),
                    '/?appName=',
                    getEnv('MONGODB_APPNAME' , null)
                );
            await this.mongoose.connect(
                MONGODB_URI,
                {
                    dbName : getEnv('MONGODB_DATABASENAME',null)
                }
            );
        } catch (error) {
            console.log('Error Connecting to DB :' , error );
            throw error;
            // throw service not available 
        }
    }

    async disconnect(){
        try {
            await this.mongoose.disconnect();
        } catch (error) {
            console.log('Error Closing Connection to DB :' , error);
            throw error;
            //throw service not available
        }
    }
}

export default DbConnection;