import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, GetUserInfo, RoleInBranchError } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('GET /user/employees', () => {
    let token: string, branchMasterId: string, userId: string, tokenNormalUser: string, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testGetAllUserInCurrentBranch();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchMasterId = dataInitial.branchMaster._id.toString();
        tokenNormalUser = dataInitial.userDirect.token.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can get all employees with admin', async () => {
        const response = await request(app)
        .get('/user/employees').set({ token: token, branch: normalBranchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        equal(result.length, 9);
    }); 

    it('Cannot get all employees with not admin', async () => {
        const response = await request(app)
        .get('/user/employees').set({ token: tokenNormalUser, branch: normalBranchId });
        const { success, result, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(result, undefined);
        equal(message, RoleInBranchError.INVALID_ROLE);
    });
});