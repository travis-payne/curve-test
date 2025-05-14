import { expect } from 'chai';
import mongoose from 'mongoose';
import sinon from 'sinon';
import { runIngestion } from '../src/ingestion';

describe('Ingestion', () => {
    let sandbox: sinon.SinonSandbox;
    let mockConnectToDB: sinon.SinonStub;
    let mockDisconnectFromDB: sinon.SinonStub;
    let mockCreateContractOneIfNotExists: sinon.SinonStub;

    const metadataRow = {
        'ID': "Leave blank if a new Track",
        'Title': null,
        'Version': null,
        'Artist': null,
        'ISRC': "Any dashes, spaces or other characters will be stripped out on import",
        'P Line': null,
        'Aliases': "Separate multiple alises using a semi-colon (;)",
        'Contract': "Should match the contract name exactly",
    };

    const metaDataRowMissingTitle = {
        'ID': "Leave blank if a new Track",
        'Version': null,
        'Artist': null,
        'ISRC': "Any dashes, spaces or other characters will be stripped out on import",
        'P Line': null,
        'Aliases': "Separate multiple alises using a semi-colon (;)",
        'Contract': "Should match the contract name exactly",
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        sandbox.stub(mongoose, 'connect').resolves();
        sandbox.stub(mongoose.connection, 'close').resolves();

        mockConnectToDB = sandbox.stub().resolves();
        mockDisconnectFromDB = sandbox.stub().resolves();
        mockCreateContractOneIfNotExists = sandbox.stub().resolves();

        sandbox.stub(require('../src/utils/db'), 'connectToDB').callsFake(mockConnectToDB);
        sandbox.stub(require('../src/utils/db'), 'disconnectFromDB').callsFake(mockDisconnectFromDB);
        sandbox.stub(require('../src/services/contract.service'), 'createContractOneIfNotExists')
            .callsFake(mockCreateContractOneIfNotExists);

        sandbox.stub(require('../src/services/contract.service'), 'findContractByName').resolves(null);
        sandbox.stub(require('../src/services/track.service'), 'saveOrUpdateTrack').resolves();
    });

    afterEach(() => {
        sandbox.restore();
        
    });

    describe('Run Ingestion', () => {
        it('should process valid spreadsheet data successfully', async () => {
            const mockRows = [
                metadataRow,
                { 'Title': 'Test Track 1', 'ISRC': 'TEST12345678', 'Contract': '' },
                { 'Title': 'Test Track 2', 'ISRC': 'TEST87654321', 'Contract': '' }
            ];

            const openSpreadsheetStub = sandbox.stub().resolves({});
            const getSheetRowsStub = sandbox.stub().returns(mockRows);
            
            sandbox.stub(require('../src/services/spreadsheet.service'), 'openSpreadsheet').callsFake(openSpreadsheetStub);
            sandbox.stub(require('../src/services/spreadsheet.service'), 'getSheetRows').callsFake(getSheetRowsStub);
            
            const errors = await runIngestion();
            expect(errors).to.be.an('array').that.is.empty;
        });

        it('should handle empty spreadsheet data', async () => {
            const mockRows: any[] = [];
            const openSpreadsheetStub = sandbox.stub().resolves({});
            const getSheetRowsStub = sandbox.stub().returns(mockRows);
            
            sandbox.stub(require('../src/services/spreadsheet.service'), 'openSpreadsheet').callsFake(openSpreadsheetStub);
            sandbox.stub(require('../src/services/spreadsheet.service'), 'getSheetRows').callsFake(getSheetRowsStub);
            
            const errors = await runIngestion();
            expect(errors).to.be.an('array').that.is.empty;
        });

        it('should handle spreadsheet with missing required headers', async () => {
            const mockRows = [
                metaDataRowMissingTitle
            ];

            const openSpreadsheetStub = sandbox.stub().resolves({});
            const getSheetRowsStub = sandbox.stub().returns(mockRows);
            
            sandbox.stub(require('../src/services/spreadsheet.service'), 'openSpreadsheet').callsFake(openSpreadsheetStub);
            sandbox.stub(require('../src/services/spreadsheet.service'), 'getSheetRows').callsFake(getSheetRowsStub);
            
            const errors = await runIngestion();
            expect(errors).to.be.an('array').that.is.empty;
        });

        it('should handle spreadsheet with some valid and invalid rows', async () => {
            const mockRows = [
                metadataRow,
                { 'Title': 'Test Track 1', 'ISRC': 'TEST12345678', 'Contract': '' },
                { 'Title': 'Test Track 2', 'ISRC': 'TEST87654321', 'Contract': '' },
                { 'ISRC': 'TEST87654321', 'Contract': '' }
            ];

            const openSpreadsheetStub = sandbox.stub().resolves({});
            const getSheetRowsStub = sandbox.stub().returns(mockRows);
            
            sandbox.stub(require('../src/services/spreadsheet.service'), 'openSpreadsheet').callsFake(openSpreadsheetStub);
            sandbox.stub(require('../src/services/spreadsheet.service'), 'getSheetRows').callsFake(getSheetRowsStub);
            
            const errors = await runIngestion();
            expect(errors).to.be.an('array').of.length(1);
        });

    });
}); 