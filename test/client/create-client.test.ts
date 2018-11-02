import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ClientError, CreateClientService } from '../../src/refs';

describe('POST /client', () => {
    let token: string, userId: string, branchId: string, normalBranchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createNormalBranch();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    });

    it('Can create client', async () => {
        const dataSend = {
            name: 'Client',
            email: 'client@gmail.com',
            phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const response = await request(app)
            .post('/client').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            __v: 0,
            sid: SID_START_AT,
            createBy: userId,
            name: 'Client',
            phone: '0908557899',
            email: 'client@gmail.com',
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet',
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            medicalHistory: []
        }
        deepEqual(result, resExpected);
    });

    it('Cannot create client with errors required', async () => {
        const dataSend1 = {
            // name: 'Client',
            email: 'client@gmail.com',
            phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = await request(app)
            .post('/client').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, ClientError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'Client',
            email: 'client@gmail.com',
            // phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res2 = await request(app)
            .post('/client').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, ClientError.PHONE_MUST_BE_PROVIDED);
    });

    it('Cannot create client with errors unique', async () => {
        await CreateClientService.create(userId, 'Name', '0123', 'email@gmail.com', Date.now());
        const dataSend1 = {
            name: 'Name',
            email: '2@gmail.com',
            phone: '0123',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = await request(app)
            .post('/client').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, ClientError.PHONE_IS_EXISTED);

        const dataSend2 = {
            name: 'Name',
            email: 'email@gmail.com',
            phone: '0223',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res2 = await request(app)
            .post('/client').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, ClientError.EMAIL_IS_EXISTED);
    });
});