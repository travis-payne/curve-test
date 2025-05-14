"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetRows = exports.openSpreadsheet = exports.areRequiredHeadersPresent = void 0;
const xlsx_1 = require("xlsx");
const logger_1 = __importDefault(require("../utils/logger"));
const consts_1 = require("../consts");
const areRequiredHeadersPresent = (headers) => {
    const missingHeaders = consts_1.REQUIRED_HEADERS.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
        logger_1.default.error(`Missing headers: ${missingHeaders.join(', ')}`);
        return false;
    }
    return true;
};
exports.areRequiredHeadersPresent = areRequiredHeadersPresent;
const openSpreadsheet = async (filename) => {
    try {
        const spreadsheet = await (0, xlsx_1.readFile)(`./data/${filename}`);
        return spreadsheet;
    }
    catch (error) {
        logger_1.default.error(`Failed to open spreadsheet ${filename}: ${error}`);
        throw new Error(`Failed to open spreadsheet ${filename}`);
    }
};
exports.openSpreadsheet = openSpreadsheet;
const getSheetRows = (spreadsheet, sheetName) => {
    try {
        const sheet = spreadsheet.Sheets[sheetName];
        const rows = xlsx_1.utils.sheet_to_json(sheet, { defval: null });
        return rows;
    }
    catch (error) {
        logger_1.default.error(`Failed to get sheet rows for ${sheetName}: ${error}`);
        throw new Error(`Failed to get sheet rows for ${sheetName}`);
    }
};
exports.getSheetRows = getSheetRows;
