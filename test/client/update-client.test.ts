import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ClientError, CreateClientService, Client, modifiedSelect, Gender } from '../../src/refs';

describe('POST /client/:clientId', () => {
    let token: string, userId: string, branchId: string, normalBranchId: string, clientId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
    });

    it('Can update client', async () => {
        const oldClient = await Client.findById(clientId).select(modifiedSelect);
        const dataSend = {
            name: 'Client update',
            email: 'clientupdate@gmail.com',
            phone: '0908557899 update',
            birthday: Date.now(),
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: '95/54 Huynh Van Banh update',
            homeTown: 'Phan Thiet update'
        };
        const response = await request(app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: clientId,
            sid: SID_START_AT,
            createBy: userId,
            name: 'Client update',
            phone: '0908557899 update',
            email: 'clientupdate@gmail.com',
            birthday: result.birthday,
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: '95/54 Huynh Van Banh update',
            homeTown: 'Phan Thiet update',
            __v: 0,
            modifieds: [{
                dataBackup: JSON.stringify(oldClient).toString(),
                updateBy: userId,
                updateAt: result.modifieds[0].updateAt,
                _id: result.modifieds[0]._id
            }],
            createAt: result.createAt,
            isActive: true,
            medicalHistory: null,
            gender: Gender.OTHER
        };
        deepEqual(result, resExpected);
    });

    it('Cannot update client with errors required', async () => {
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
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
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
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, ClientError.PHONE_MUST_BE_PROVIDED);
    });

    it('Cannot update client with errors unique', async () => {
        await CreateClientService.create(userId, { name: 'Name01', phone: '012301', email: 'email01@gmail.com', birthday: Date.now() });
        const dataSend1 = {
            name: 'Name',
            email: '2@gmail.com',
            phone: '012301',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = await request(app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, ClientError.PHONE_IS_EXISTED);

        const dataSend2 = {
            name: 'Name',
            email: 'email01@gmail.com',
            phone: '0223',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res2 = await request(app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend2);
        equal(res2.status, 400);
        equal(res2.body.success, false);
        equal(res2.body.message, ClientError.EMAIL_IS_EXISTED);
    });

    it('Cannot update a remove client', async () => {
        await Client.findByIdAndRemove(clientId);
        const dataSend1 = {
            name: 'Client',
            email: 'client@gmail.com',
            phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = await request(app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.status, 400);
        equal(res1.body.success, false);
        equal(res1.body.message, ClientError.CANNOT_FIND_CLIENT);
    });
});