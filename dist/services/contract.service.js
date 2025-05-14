"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findContractByName = void 0;
exports.createContractOneIfNotExists = createContractOneIfNotExists;
const contract_model_1 = __importDefault(require("../models/contract.model"));
const consts_1 = require("../consts");
const logger_1 = __importDefault(require("../utils/logger"));
async function createContractOneIfNotExists() {
    const existingContract = await contract_model_1.default.findOne({ name: consts_1.CONTRACT_1 });
    if (!existingContract) {
        logger_1.default.info(`Contract ${consts_1.CONTRACT_1} not found, creating in DB...`);
        const contract = new contract_model_1.default({ name: consts_1.CONTRACT_1 });
        await contract.save();
    }
}
const findContractByName = async (name) => {
    return await contract_model_1.default.findOne({ name: name });
};
exports.findContractByName = findContractByName;
