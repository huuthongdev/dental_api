import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, Branch, BranchError, SID_START_AT } from '../../src/refs';

describe('GET /branch/user-in-current-branch', () => {
    let token: string, branchId: string, userId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.testGetAllUserInCurrentBranch();
        token = dataInit.userDirect.token.toString();
        branchId = dataInit.normalBranch._id.toString();
        userId = dataInit.rootUser._id.toString();
    });

    it('Can get all user in current branch', async () => {
        const response = await request(app)
            .get('/branch/user-in-current-branch').set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(result.length, 8);
        const user1 = {
            _id: result[0]._id,
            sid: SID_START_AT + 1,
            name: 'User 1',
            email: 'user1@gmail.com',
            phone: '01',
            createBy: userId,
            __v: 0,
            modifieds: [] as [],
            createAt: result[0].createAt,
            roleInBranchs: result[0].roleInBranchs,
            isActive: true,
            passwordVersion: 1
        }
        deepEqual(result[0], user1);

        const user2 = {
            _id: result[1]._id,
            sid: SID_START_AT + 2,
            name: 'User 2',
            email: 'user2@gmail.com',
            phone: '02',
            createBy: userId,
            __v: 0,
            modifieds: [] as [],
            createAt: result[1].createAt,
            roleInBranchs: result[1].roleInBranchs,
            isActive: true,
            passwordVersion: 1
        }
        deepEqual(result[1], user2);
    });
});