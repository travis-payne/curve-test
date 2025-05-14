import { expect } from 'chai';
import sinon from 'sinon';
import { createContractOneIfNotExists, findContractByName } from '../../src/services/contract.service';
import Contract from '../../src/models/contract.model';
import { CONTRACT_1 } from '../../src/consts';
import { IContract } from '../../src/models/contract.model';

describe('Contract Service', () => {
    let findOneStub: sinon.SinonStub;
    let saveStub: sinon.SinonStub;

    beforeEach(() => {
        findOneStub = sinon.stub(Contract, 'findOne');
        saveStub = sinon.stub(Contract.prototype, 'save');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createContractIfNotExists', () => {
        it('should create contract if it does not exist', async () => {
            findOneStub.resolves(null);
            saveStub.resolves();

            await createContractOneIfNotExists();

            expect(findOneStub.calledWith({ name: CONTRACT_1 })).to.be.true;
            expect(saveStub.called).to.be.true;
        });

        it('should not create contract if it already exists', async () => {
            const existingContract = { name: CONTRACT_1 } as IContract;
            findOneStub.resolves(existingContract);

            await createContractOneIfNotExists();

            expect(findOneStub.calledWith({ name: CONTRACT_1 })).to.be.true;
            expect(saveStub.called).to.be.false;
        });
    });
});