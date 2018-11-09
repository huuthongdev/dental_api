import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, Branch, BranchError, SID_START_AT } from '../../src/refs';

describe('PUT /remove/:branchId', () => {
    let userId: string, token: string, branchId: string, branchMasterId: string, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can remove branch', async () => {
        const response = await request(app)
            .delete('/branch/' + normalBranchId)
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
            isActive: true,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false
        };
        deepEqual(result, resExpected);
        // Check database
        const branchDb = await Branch.findById(normalBranchId);
        equal(branchDb, undefined);
    });

    it('Cannot remove removed branch', async () => {
        await Branch.findByIdAndRemove(normalBranchId);
        const response = await request(app)
            .delete('/branch/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot disable with invalid id', async () => {
        const response = await request(app)
            .delete('/branch/' + 'branchId')
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'INVALID_ID');
    });

    it('Cannot remove master branch', async () => {
        const response = await request(app)
            .delete('/branch/' + branchId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.CANNOT_REMOVE_MASTER_BRANCH);
    });
});