import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, UpdateProfileUserInput, SID_START_AT, UserError } from '../../src/refs';
import { InititalDatabaseForTest } from '../init-database-for-test';

describe('PUT /user/:userUpdateId', () => {
    let token: string, userId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can update profile user', async () => {
        const birthday = Date.now();
        const dataSend = {
            name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        } as UpdateProfileUserInput;
        const response = await request(app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: userId,
            sid: SID_START_AT,
            name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            __v: 0,
            address: 'address update',
            birthday,
            city: 'HCM Update',
            district: 'district Update',
            homeTown: 'homeTown Update',
            roleInBranchs: result.roleInBranchs,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isActive: true
        }
        deepEqual(result, resExpected);
    });

    it('Cannot update with errors required', async () => {
        const birthday = Date.now();
        const dataSend1 = {
            // name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        } as UpdateProfileUserInput;
        const response1 = await request(app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend1);
        equal(response1.body.success, false);
        equal(response1.status, 400);
        equal(response1.body.message, UserError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'Update',
            // email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        } as UpdateProfileUserInput;
        const response2 = await request(app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend2);
        equal(response2.body.success, false);
        equal(response2.status, 400);
        equal(response2.body.message, UserError.EMAIL_MUST_BE_PROVIDED);

        const dataSend3 = {
            name: 'Update',
            email: 'updategmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        } as UpdateProfileUserInput;
        const response3 = await request(app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend3);
        equal(response3.body.success, false);
        equal(response3.status, 400);
        equal(response3.body.message, UserError.EMAIL_INCORRECT);

        const dataSend4 = {
            name: 'Update',
            email: 'update@gmail.com',
            // phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        } as UpdateProfileUserInput;
        const response4 = await request(app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend4);
        equal(response4.body.success, false);
        equal(response4.status, 400);
        equal(response4.body.message, UserError.PHONE_MUST_BE_PROVIDED);
    });
});