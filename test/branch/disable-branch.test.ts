import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, Branch, BranchError, SID_START_AT } from '../../src/refs';

describe('PUT /disable/:branchId', () => {
    let userId: string, token: string, branchId: string, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can disbale branch', async () => {
        const response = await request(app)
            .put('/branch/disable/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: normalBranchId,
            sid: SID_START_AT + 2,
            name: 'Normal Branch',
            email: 'normalbranch@gmail.com',
            phone: '0123',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'Address',
            createBy: userId,
            __v: 0,
            isActive: false,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false
        };
        deepEqual(result, resExpected);
    });

    it('Cannot disable remove branch', async () => {
        await Branch.findByIdAndRemove(normalBranchId);
        const response = await request(app)
            .put('/branch/disable/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot disable with invalid id', async () => {
        const response = await request(app)
            .put('/branch/disable/' + 'branchId')
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'INVALID_ID');
    });
});