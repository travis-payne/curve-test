"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIngestion = runIngestion;
const logger_1 = __importDefault(require("./utils/logger"));
const consts_1 = require("./consts");
const db_1 = require("./utils/db");
const contract_service_1 = require("./services/contract.service");
const spreadsheet_service_1 = require("./services/spreadsheet.service");
const errors_1 = require("./utils/errors");
const track_service_1 = require("./services/track.service");
const track_model_1 = __importDefault(require("./models/track.model"));
const mongoose_1 = __importDefault(require("mongoose"));
async function runIngestion() {
    console.log('Connecting to DB, with URI: ', consts_1.MONGODB_URI);
    await (0, db_1.connectToDB)();
    await (0, contract_service_1.createContractOneIfNotExists)();
    const spreadsheet = await (0, spreadsheet_service_1.openSpreadsheet)(consts_1.SPREADSHEET_FILENAME);
    const rows = (0, spreadsheet_service_1.getSheetRows)(spreadsheet, 'Sheet1');
    if (rows.length === 0) {
        logger_1.default.info('No rows found in spreadsheet');
        return [];
    }
    const headers = Object.keys(rows[0]);
    // The only required headers are Title and ISRC. If either of these aren't present, we shouldn't
    // process the rest of the spreadsheet.
    if (!(0, spreadsheet_service_1.areRequiredHeadersPresent)(headers)) {
        return [];
    }
    const errorTracker = new errors_1.ErrorTracker();
    let successfulIngestions = 0;
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const lineNumber = i + 3; // +3 because of 0-indexing, header row and metadata row
        const trackData = (0, track_service_1.extractTrackData)(row);
        // We check here to see if the required properties exist, there could be more than one issue
        // with a line, so we should collect of them, and return to the user at once, instead of only
        // giving them one error at a time.
        if (!trackData.title) {
            errorTracker.addMissingFieldError(lineNumber, 'Title');
        }
        if (!trackData.isrc) {
            errorTracker.addMissingFieldError(lineNumber, 'ISRC');
        }
        let contract = null;
        if (trackData.contractId) {
            contract = await (0, contract_service_1.findContractByName)(trackData.contractId);
            if (!contract) {
                errorTracker.addContractNotFoundError(lineNumber, trackData.contractId);
            }
        }
        // If a line has any errors, it is not valid, and we should continue processing the rest of the sheet
        if (errorTracker.hasErrorsForLine(lineNumber)) {
            continue;
        }
        await (0, track_service_1.saveOrUpdateTrack)(new track_model_1.default({
            _id: trackData.id ? new mongoose_1.default.Types.ObjectId(trackData.id) : undefined,
            ...trackData,
            contractId: contract?._id,
        }));
        successfulIngestions++;
    }
    logger_1.default.info(`Successfully ingested ${successfulIngestions} tracks.`);
    errorTracker.logErrors();
    await (0, db_1.disconnectFromDB)();
    return errorTracker.getErrorArray();
}
