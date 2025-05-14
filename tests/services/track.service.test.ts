import { expect } from 'chai';
import sinon from 'sinon';
import { extractTrackData } from '../../src/services/track.service';
import Track from '../../src/models/track.model';

describe('Track Service', () => {
    let findOneAndUpdateStub: sinon.SinonStub;

    beforeEach(() => {
        findOneAndUpdateStub = sinon.stub(Track, 'findOneAndUpdate').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('extractTrackData', () => {
        it('should correctly extract and clean track data', () => {
            const mockRow = {
                'ID': '123',
                'Title': 'Test Track',
                'ISRC': 'US-RC1.12345678',
                'Contract': 'CONTRACT123',
                'Aliases': 'Alias 1; Alias 2',
                'Artist': 'Test Artist',
                'Version': '1.0',
                'P Line': 'P Line Test'
            };

            const result = extractTrackData(mockRow);

            expect(result).to.deep.equal({
                id: '123',
                title: 'Test Track',
                isrc: 'USRC112345678',
                contractId: 'CONTRACT123',
                aliases: ['Alias 1', 'Alias 2'],
                artist: 'Test Artist',
                version: '1.0',
                pLine: 'P Line Test'
            });
        });

        it('should handle empty aliases', () => {
            const mockRow = {
                'ID': '123',
                'Title': 'Test Track',
                'ISRC': 'USRC112345678',
                'Contract': 'CONTRACT123',
                'Aliases': '',
                'Artist': 'Test Artist',
                'Version': '1.0',
                'P Line': 'P Line Test'
            };

            const result = extractTrackData(mockRow);

            expect(result.aliases).to.deep.equal([]);
        });

        it('should clean ISRC with various special characters', () => {
            const testCases = [
                { input: 'US-RC1.12345678', expected: 'USRC112345678' },
                { input: 'GB ABC-1234567', expected: 'GBABC1234567' },
                { input: 'FR@123$456%789', expected: 'FR123456789' },
                { input: 'DE 123 456 789', expected: 'DE123456789' },
                { input: 'IT-123.456-789', expected: 'IT123456789' }
            ];

            testCases.forEach(({ input, expected }) => {
                const mockRow = {
                    'ID': '123',
                    'Title': 'Test Track',
                    'ISRC': input,
                    'Contract': 'CONTRACT123',
                    'Aliases': '',
                    'Artist': 'Test Artist',
                    'Version': '1.0',
                    'P Line': 'P Line Test'
                };

                const result = extractTrackData(mockRow);
                expect(result.isrc).to.equal(expected);
            });
        });
    });
}); 