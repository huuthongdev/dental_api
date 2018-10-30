import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { CreateUserService, app, UserError } from '../../src/refs';
import { InitDatabaseForTest } from '../init-database-for-test';

describe('POST /user/', () => {
    let token: string, userId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.loginRootAccount();
        token = dataInit.token.toString();
        userId = dataInit._id.toString();
    });

    it('Can create new user', async () => {
        const dataSend = {
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const response = await request(app)
            .post('/user').set({ token }).send(dataSend);
        equal(response.status, 200);
        const { success, result } = response.body;
        equal(success, true);
        const resExpected: any = {
            sid: 2,
            isActive: true,
            __v: 0,
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            birthday: 850237200000,
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [],
            passwordVersion: 1
        };
        deepEqual(result, resExpected);
    });

    xit('Can create new user with role in branch', async () => {
        // TODO:
    });

    it('Cannot create new user with empty required input', async () => {
        const dataSend1 = {
            // name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res1 = await request(app)
            .post('/user').set({ token }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.message, UserError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'User name',
            // email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res2 = await request(app)
            .post('/user').set({ token }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.message, UserError.EMAIL_MUST_BE_PROVIDED);

        const dataSend3 = {
            name: 'User name',
            email: 'email@gmail.com',
            // phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res3 = await request(app)
            .post('/user').set({ token }).send(dataSend3);
        equal(res3.status, 400);
        equal(res3.body.message, UserError.PHONE_MUST_BE_PROVIDED);

        const dataSend4 = {
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            // password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res4 = await request(app)
            .post('/user').set({ token }).send(dataSend4);
        equal(res4.status, 400);
        equal(res4.body.message, UserError.PASSWORD_MUST_BE_PROVIDED);
    });

    it('Cannot create new user errors unique', async () => {
        await CreateUserService.create(userId, 'Name unique', 'email@gmail.com', '090', 'Password');
        const dataSend1 = {
            name: 'user name',
            email: 'email@gmail.com',
            phone: '0909777',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res1 = await request(app)
            .post('/user').set({ token }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, UserError.EMAIL_IS_EXISTED);

        const dataSend2 = {
            name: 'user name',
            email: 'emaildifferent@gmail.com',
            phone: '090',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        }
        const res2 = await request(app)
            .post('/user').set({ token }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, UserError.PHONE_IS_EXISTED);
    });
});