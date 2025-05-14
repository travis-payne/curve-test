import Contract, { IContract } from "../models/contract.model";
import { CONTRACT_1 } from "../consts";
import logger from "../utils/logger";

export async function createContractOneIfNotExists(): Promise<void> {
    const existingContract = await Contract.findOne({ name: CONTRACT_1 });
    
    if (!existingContract) {
        logger.info(`Contract ${CONTRACT_1} not found, creating in DB...`);
        const contract = new Contract({ name: CONTRACT_1 });
        await contract.save();
    }
}

export const findContractByName = async (name: string): Promise<IContract | null> => {
    return await Contract.findOne({ name: name });
}

