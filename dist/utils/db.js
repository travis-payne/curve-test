"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDB = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const consts_1 = require("../consts");
const logger_1 = __importDefault(require("./logger"));
const connectToDB = async () => {
    logger_1.default.info(`Connecting to DB, with URI: ${consts_1.MONGODB_URI}`);
    try {
        await mongoose_1.default.connect(consts_1.MONGODB_URI);
        logger_1.default.info('Connected to MongoDB successfully');
    }
    catch (error) {
        logger_1.default.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};
exports.connectToDB = connectToDB;
const disconnectFromDB = async () => {
    await mongoose_1.default.connection.close();
    logger_1.default.info('Disconnected from MongoDB');
};
exports.disconnectFromDB = disconnectFromDB;
