import { expect } from 'chai';
import { ErrorTracker } from '../../src/utils/errors';

describe('Error Tracker', () => {
    let errorTracker: ErrorTracker;

    beforeEach(() => {
        errorTracker = new ErrorTracker();
    });

    describe('addMissingFieldError', () => {
        it('should add missing field error', () => {
            errorTracker.addMissingFieldError(1, 'Title');
            expect(errorTracker.hasErrorsForLine(1)).to.be.true;
        });

        it('should track multiple missing fields for same line', () => {
            errorTracker.addMissingFieldError(1, 'Title');
            errorTracker.addMissingFieldError(1, 'ISRC');
            expect(errorTracker.hasErrorsForLine(1)).to.be.true;
        });
    });

    describe('addContractNotFoundError', () => {
        it('should add contract not found error', () => {
            errorTracker.addContractNotFoundError(1, 'Non Existent Contract');
            expect(errorTracker.hasErrorsForLine(1)).to.be.true;
        });
    });

    describe('hasErrorsForLine', () => {
        it('should return false for line with no errors', () => {
            expect(errorTracker.hasErrorsForLine(1)).to.be.false;
        });

        it('should return true for line with errors', () => {
            errorTracker.addMissingFieldError(1, 'Title');
            expect(errorTracker.hasErrorsForLine(1)).to.be.true;
        });
    });

    describe('getErrorArray', () => {
        it('should return array of length equal to number of lines with errors', () => {
            errorTracker.addMissingFieldError(1, 'Title');
            errorTracker.addMissingFieldError(1, 'ISRC');
            errorTracker.addContractNotFoundError(2, 'Non Existent Contract');

            const errors = errorTracker.getErrorArray();
            expect(errors).to.have.lengthOf(2);
        });
    });
}); 