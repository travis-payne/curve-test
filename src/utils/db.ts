import mongoose from 'mongoose';
import { MONGODB_URI } from '../consts';
import logger from './logger';

export const connectToDB = async () => {
    logger.info(`Connecting to DB, with URI: ${MONGODB_URI}`);
    try {
        await mongoose.connect(MONGODB_URI);
        logger.info('Connected to MongoDB successfully');
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

export const disconnectFromDB = async () => {
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
}
