import { readFile, utils, WorkBook } from "xlsx";
import logger from "../utils/logger";
import { REQUIRED_HEADERS } from "../consts";


export const areRequiredHeadersPresent = (headers: string[]): boolean => {
    const missingHeaders = REQUIRED_HEADERS.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        logger.error(`Missing headers: ${missingHeaders.join(', ')}`);
        return false;
    }
    return true;
}

export const openSpreadsheet = async (filename: string) => {
    try {
        const spreadsheet = await readFile(`./data/${filename}`);
        return spreadsheet;
    } catch (error) {
        logger.error(`Failed to open spreadsheet ${filename}: ${error}`);
        throw new Error(`Failed to open spreadsheet ${filename}`);
    }
}

export const getSheetRows = (spreadsheet: WorkBook, sheetName: string) => {
    try {
        const sheet = spreadsheet.Sheets[sheetName];
        const rows = utils.sheet_to_json(sheet,{ defval: null }) as { [key: string]: string }[];
        return rows;
    } catch (error) {
        logger.error(`Failed to get sheet rows for ${sheetName}: ${error}`);
        throw new Error(`Failed to get sheet rows for ${sheetName}`);
    }
}