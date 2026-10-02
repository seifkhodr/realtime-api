import dotenv from 'dotenv';
import { InternalServerError } from '../utils/AppError.js';

dotenv.config();

const getEnv = (key, defaultValue = undefined) => {
    const value = process.env[key]?.trim();

    if (value)
        return value;

    if (defaultValue !== undefined && defaultValue !== null)
        return defaultValue;

    throw new InternalServerError(`Missing required environment variable: ${key}`);
};

export default getEnv;