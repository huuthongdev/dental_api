import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app } from '../../src/refs';

describe.only('POST /branch/', () => {
    let userId: string, token: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.loginRootAccount();
        userId = dataInit._id.toString();
        token = dataInit.token.toString();
    });

    it('Can create new Branch', async () => {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const response = await request(app)
            .post('/branch/').set({ token }).send(dataSend);
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            __v: 0,
            sid: 1,
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false
        }
        deepEqual(result, resExpected);
    });
});