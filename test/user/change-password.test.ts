import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, DEFAULT_PASSWORD, ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, ChangePasswordService, UserError, SID_START_AT, Role } from '../../src/refs';
import { InitDatabaseForTest } from '../init-database-for-test';

describe('POST /user/change-password', () => {
    let token: string, userId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.loginRootAccount();
        token = dataInit.rootUser.token.toString();
        userId = dataInit.rootUser._id.toString();
        branchId = dataInit.branchMaster._id.toString();
    });

    it('Can change password', async () => {
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
            birthday: 850237200000,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs:
                [{
                    _id: result.roleInBranchs[0]._id,
                    branch: result.roleInBranchs[0].branch,
                    __v: 0,
                    roles: [Role.CHAIRMAN]
                }],
            isActive: true,
            passwordVersion: 2
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