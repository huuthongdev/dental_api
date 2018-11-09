import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, DEFAULT_PASSWORD, ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, ChangePasswordService, UserError, SID_START_AT, Role, User } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('POST /user/change-password', () => {
    let token: string, userId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can change password', async () => {
        const oldUser = await User.findById(userId);
        const response = await request(app)
            .post('/user/change-password').set({ token, branch: branchId }).send({ oldPassword: DEFAULT_PASSWORD, newPassword: 'Perline@2018' });
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            _id: userId,
            sid: 10000,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true
        };
        deepEqual(result, resExpected);
    });

    it('Cannot change password with old password incorrect', async () => {
        const response = await request(app)
            .post('/user/change-password').set({ token, branch: branchId }).send({ oldPassword: 'DEFAULT_PASSWORD', newPassword: 'Perline@2018' });
        const { success, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, UserError.OLD_PASSWORD_INCORRECT);
    });
});