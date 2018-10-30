import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, CreateBranchService, BranchError } from '../../src/refs';

describe('POST /branch/', () => {
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

    it('Can create new master Branch', async () => {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            isMaster: true
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
            isMaster: true
        }
        deepEqual(result, resExpected);
    });

    it('Cannot create new Branch with invalid input', async () => {
        const dataSend = {
            // name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res = await request(app)
            .post('/branch/').set({ token }).send(dataSend);
        equal(res.status, 400);
        equal(res.body.success, false);
        equal(res.body.message, BranchError.NAME_MUST_BE_PROVIDED);
    });

    it('Cannot create new Branch error unique', async () => {
        await CreateBranchService.create(userId, 'Name', 'branch@gmail.com', '0908557899', 'HCM', 'Phu Nhuan', 'Address');
        const dataSend1 = {
            name: 'Name',
            email: 'branch2@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res1 = await request(app)
            .post('/branch/').set({ token }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, BranchError.NAME_IS_EXISTED);

        const dataSend2 = {
            name: 'Name 2',
            email: 'branch@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res2 = await request(app)
            .post('/branch/').set({ token }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, BranchError.EMAIL_IS_EXISTED);

        const dataSend3 = {
            name: 'Name 2',
            email: 'branch2@gmail.com',
            phone: '0908557899',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        }
        const res3 = await request(app)
            .post('/branch/').set({ token }).send(dataSend3);
        equal(res3.status, 400);
        equal(res3.body.success, false);
        equal(res3.body.message, BranchError.PHONE_IS_EXISTED);
    });

    it('Cannot create two master Branch', async () => {
        await CreateBranchService.create(userId, 'Name', 'branch@gmail.com', '0908557899', 'HCM', 'Phu Nhuan', 'Address', true);
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            isMaster: true
        }
        const res = await request(app)
            .post('/branch/').set({ token }).send(dataSend);
        equal(res.status, 400);
        equal(res.body.success, false);
        equal(res.body.message, BranchError.ONLY_ONE_MASTER_BRANCH);
    });
});