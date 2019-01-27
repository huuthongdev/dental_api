import request from 'supertest';
import { equal } from 'assert';
import { app, LoginService } from '../../src/refs';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';

describe('Check have role middleware', () => {
    let token: string, branchId: string, userId: string, dentistId: any, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testGetAllUserInCurrentBranch();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can access with valid role with admin', async () => {
        const response = await request(app)
            .get('/dev/middleware/must-have-role')
            .set({ token, branch: branchId });
        const { error, success } = response.body;
        equal(success, true);
    });

    it('Can access with valid role with dentist', async () => {
        const dentist = await LoginService.login('user2@gmail.com', 'password');
        const response = await request(app)
            .get('/dev/middleware/must-have-role')
            .set({ token: dentist.token, branch: normalBranchId });
        const { error, success } = response.body;
        equal(success, true);
    })
});