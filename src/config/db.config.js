import getEnv from './env.config.js';
import mongoose from 'mongoose';
import { ServiceUnavailableError } from '../utils/AppError.js';

class DbConnection {
    constructor(){
        this.mongoose = mongoose;
    }

    async connect(){
        try {
            const MONGODB_URI = process.env.MONGODB_URI?.trim() || "mongodb+srv://"
                .concat(
                    encodeURIComponent(getEnv('MONGODB_USERNAME')),
                    ':',
                    encodeURIComponent(getEnv('MONGODB_PASSWORD')),
                    '@',
                    getEnv('MONGODB_CLUSTER'),
                    '/?appName=',
                    encodeURIComponent(getEnv('MONGODB_APPNAME'))
                );
            await this.mongoose.connect(
                MONGODB_URI,
                {
                    dbName : getEnv('MONGODB_DATABASENAME')
                }
            );
        } catch (error) {
            console.log('Error Connecting to DB :' , error );
            throw new ServiceUnavailableError('Database service unavailable');
        }
    }

    async disconnect(){
        try {
            await this.mongoose.disconnect();
        } catch (error) {
            console.log('Error Closing Connection to DB :' , error);
            throw new ServiceUnavailableError('Database service unavailable');
        }
    }
}

export default DbConnection;