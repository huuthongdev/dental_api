import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, DEFAULT_PASSWORD, ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, ChangePasswordService } from '../../src/refs';
import { InitDatabaseForTest } from '../init-database-for-test';

const { errors } = ChangePasswordService;

describe('POST /user/change-password', () => {
    let token: string, userId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.loginRootAccount();
        token = dataInit.token.toString();
        userId = dataInit._id.toString();
    });

    it('Can change password', async () => {
        const response = await request(app)
            .post('/user/change-password').set({ token }).send({ oldPassword: DEFAULT_PASSWORD, newPassword: 'Perline@2018' });
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            _id: result._id,
            sid: 1,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [],
            isActive: true,
            passwordVersion: 2
        };
        deepEqual(result, resExpected);
    });

    it('Cannot change password with old password incorrect', async () => {
        const response = await request(app)
            .post('/user/change-password').set({ token }).send({ oldPassword: 'DEFAULT_PASSWORD', newPassword: 'Perline@2018' });
        const { success, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, errors.OLD_PASSWORD_INCORRECT);
    });
});