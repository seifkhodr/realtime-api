import dotenv from 'dotenv';
import { InternalServerError } from '../utils/AppError.js';

dotenv.config();

const getEnv = (key, defaultValue = undefined) => {
    const environmentValue = process.env[key]?.trim();

    if (environmentValue)
        return environmentValue;

    if (defaultValue !== undefined && defaultValue !== null)
        return defaultValue;

    throw new InternalServerError(`Missing required environment variable: ${key}`);
};

export default getEnv;