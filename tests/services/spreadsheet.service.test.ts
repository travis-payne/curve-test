import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { areRequiredHeadersPresent, openSpreadsheet, getSheetRows } from '../../src/services/spreadsheet.service';
import { SPREADSHEET_FILENAME } from '../../src/consts';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Spreadsheet Service', () => {
    describe('areRequiredHeadersPresent', () => {
        it('should return false when required headers are missing', () => {
            const headers = ['Invalid Header'];
            expect(areRequiredHeadersPresent(headers)).to.be.false;
        });

        it('should return true when all required headers are present', () => {
            const headers = ['Title', 'ISRC'];
            expect(areRequiredHeadersPresent(headers)).to.be.true;
        });

        it('should return true when required headers are present with additional headers', () => {
            const headers = ['Title', 'ISRC', 'Aliases', 'Contract'];
            expect(areRequiredHeadersPresent(headers)).to.be.true;
        });
    });

    describe('openSpreadsheet', () => {
        it('should throw error when file does not exist', async () => {
            await expect(openSpreadsheet('non-existent-file.xlsx')).to.be.rejected;
        });

        it('should open existing spreadsheet', async () => {
            const spreadsheet = await openSpreadsheet(SPREADSHEET_FILENAME);
            expect(spreadsheet).to.exist;
        });
    });

    describe('getSheetRows', () => {
        it('should return array of rows from sheet', async () => {
            const spreadsheet = await openSpreadsheet(SPREADSHEET_FILENAME);
            const rows = getSheetRows(spreadsheet, 'Sheet1');
            expect(rows).to.be.an('array');
            expect(rows.length).to.be.greaterThan(0);
        });

        it('should throw error for non-existent sheet', async () => {
            const spreadsheet = await openSpreadsheet(SPREADSHEET_FILENAME);
            try {
                getSheetRows(spreadsheet, 'NonExistentSheet');
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });
}); 