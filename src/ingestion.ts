import logger from './utils/logger';
import { IContract } from './models/contract.model';
import { SPREADSHEET_FILENAME, MONGODB_URI } from './consts';
import { connectToDB, disconnectFromDB } from './utils/db';
import { createContractOneIfNotExists, findContractByName } from './services/contract.service';
import { areRequiredHeadersPresent, openSpreadsheet, getSheetRows } from './services/spreadsheet.service';
import { ErrorTracker } from './utils/errors';
import { extractTrackData, saveOrUpdateTrack } from './services/track.service';
import Track from './models/track.model';
import mongoose from 'mongoose';

async function runIngestion() {

    console.log('Connecting to DB, with URI: ', MONGODB_URI);
    await connectToDB();
    await createContractOneIfNotExists();
    
    const spreadsheet = await openSpreadsheet(SPREADSHEET_FILENAME);
    const rows = getSheetRows(spreadsheet, 'Sheet1');

    if(rows.length === 0) {
        logger.info('No rows found in spreadsheet');
        return [];
    }

    const headers = Object.keys(rows[0]);
    // The only required headers are Title and ISRC. If either of these aren't present, we shouldn't
    // process the rest of the spreadsheet.
    if (!areRequiredHeadersPresent(headers)) {
        return [];
    }
    
    const errorTracker = new ErrorTracker();

    let successfulIngestions = 0;

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const lineNumber = i + 3; // +3 because of 0-indexing, header row and metadata row
        
        const trackData = extractTrackData(row);

        // We check here to see if the required properties exist, there could be more than one issue
        // with a line, so we should collect of them, and return to the user at once, instead of only
        // giving them one error at a time.
        if (!trackData.title) {
            errorTracker.addMissingFieldError(lineNumber, 'Title');
        }
        
        if (!trackData.isrc) {
            errorTracker.addMissingFieldError(lineNumber, 'ISRC');
        }

        let contract: IContract | null = null;
        if (trackData.contractId) {
            contract = await findContractByName(trackData.contractId);
            if (!contract) {
                errorTracker.addContractNotFoundError(lineNumber, trackData.contractId);
            }
        }

        // If a line has any errors, it is not valid, and we should continue processing the rest of the sheet
        if (errorTracker.hasErrorsForLine(lineNumber)) {
            continue;
        }

        await saveOrUpdateTrack(new Track({
            _id: trackData.id ? new mongoose.Types.ObjectId(trackData.id) : undefined,
            ...trackData,
            contractId: contract?._id,
        }));
        
        successfulIngestions++;
    }

    logger.info(`Successfully ingested ${successfulIngestions} tracks.`);
    errorTracker.logErrors();
    
    await disconnectFromDB();

    return errorTracker.getErrorArray();
}

export { runIngestion };