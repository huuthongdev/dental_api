import request from 'supertest';
import { equal } from 'assert';
import { app, User, UserError, Branch, BranchError, RemoveBranchService } from '../../src/refs';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';

describe('Check must be user middleware', () => {
    let token: string, branchId: string, userId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can next with valid info', async () => {
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success } = response.body;
        equal(success, true);
        equal(response.status, 200);
    });

    it('Cannot next with empty token', async () => {
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'INVALID_TOKEN');
    });

    it('Cannot next with empty branch', async () => {
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ token });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'BRANCH_ID_MUST_BE_PROVIDED');
    });

    it('Cannot next when removed user', async () => {
        await User.findByIdAndRemove(userId);
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, UserError.CANNOT_FIND_USER);
    });

    it('Cannot next when removed branch', async () => {
        await Branch.findByIdAndRemove(branchId);
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.CANNOT_FIND_BRANCH);
    });

    it('Cannot next when disabled branch', async () => {
        await RemoveBranchService.disable(userId, branchId);
        const response = await request(app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, BranchError.BRANCH_IS_DISABLED);
    });
});