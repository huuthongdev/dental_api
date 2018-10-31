import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, Branch, BranchError } from '../../src/refs';

describe('PUT /enalble/:branchId', () => {
    let userId: string, token: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.createRootBranch();
        userId = dataInit.rootUser._id.toString();
        token = dataInit.rootUser.token.toString();
        branchId = dataInit.normalBranch._id.toString();
        await Branch.findByIdAndUpdate(branchId, { isActive: true });
    });

    it('Can enable branch', async () => {
        const response = await request(app)
            .put('/branch/enable/' + branchId)
            .set({ token });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: branchId,
            sid: 2,
            name: 'Branch name 2',
            email: 'brand2@gmail.com',
            phone: '09092',
            city: 'HCM2',
            district: 'Phu Nhuan2',
            address: 'Address2',
            createBy: userId,
            __v: 0,
            isActive: true,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false
        };
        deepEqual(result, resExpected);
    });

    it('Cannot enable remove branch', async () => {
        await Branch.findByIdAndRemove(branchId);
        const response = await request(app)
            .put('/branch/enable/' + branchId)
            .set({ token });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot disable with invalid id', async () => {
        const response = await request(app)
            .put('/branch/enable/' + 'branchId')
            .set({ token });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'INVALID_ID');
    });
});