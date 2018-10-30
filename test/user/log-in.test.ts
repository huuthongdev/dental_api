import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_NAME, ROOT_PHONE, LoginService, User, UserError } from '../../src/refs';

describe('POST /user/log-in', () => {
    it('Can login with Email', async () => {
        const response = await request(app)
            .post('/user/log-in').send({ email: ROOT_EMAIL, password: DEFAULT_PASSWORD });
        equal(response.status, 200);
        const { success, result } = response.body;
        equal(success, true);
        const resExpected: any = {
            sid: 1,
            isActive: true,
            _id: result._id,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            password: result.password,
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [],
            passwordVersion: 1,
            token: result.token
        }
        deepEqual(response.body.result, resExpected);
    });

    it('Can login with Phone', async () => {
        const response = await request(app)
            .post('/user/log-in').send({ phone: ROOT_PHONE, password: DEFAULT_PASSWORD });
        equal(response.status, 200);
        const { success, result } = response.body;
        equal(success, true);
        const resExpected: any = {
            sid: 1,
            isActive: true,
            _id: result._id,
            name: ROOT_NAME,
            email: ROOT_EMAIL,
            phone: ROOT_PHONE,
            password: result.password,
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '99 Nguyễn Văn Trỗi',
            homeTown: 'HA NOI',
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [],
            passwordVersion: 1,
            token: result.token
        }
        deepEqual(response.body.result, resExpected);
    });

    it('Cannot login with invalid info', async () => {
        const res1 = await request(app)
            .post('/user/log-in').send({ phone: 'ROOT_PHONE', password: DEFAULT_PASSWORD });
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, UserError.INVALID_LOG_IN_INFO);

        const res2 = await request(app)
            .post('/user/log-in').send({ email: 'ROOT_PHONE', password: DEFAULT_PASSWORD });
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, UserError.INVALID_LOG_IN_INFO);

        const res3 = await request(app)
            .post('/user/log-in').send({ email: ROOT_EMAIL, password: 'DEFAULT_PASSWORD' });
        equal(res3.status, 400);
        equal(res3.body.success, false);
        equal(res3.body.message, UserError.INVALID_LOG_IN_INFO);
    });

    it('Cannot login with removed user', async () => {
        await User.remove({});
        const response = await request(app)
            .post('/user/log-in').send({ email: ROOT_EMAIL, password: DEFAULT_PASSWORD });
        equal(response.status, 400);
        equal(response.body.success, false);
        equal(response.body.message, UserError.INVALID_LOG_IN_INFO);
    });
});