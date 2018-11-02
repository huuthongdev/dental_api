import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ClientError, CreateClientService, Client, modifiedSelect } from '../../src/refs';

describe('PUT /client/enable/:clientId', () => {
    let token: string, userId: string, branchId: string, normalBranchId: string, clientId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
        await Client.findByIdAndUpdate(clientId, { isActive: false });
    });

    it('can enable client', async () => {
        const oldClient = await Client.findById(clientId).select(modifiedSelect);
        const response = await request(app)
            .put('/client/enable/' + clientId).set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: clientId,
            sid: SID_START_AT,
            createBy: userId,
            name: 'Client',
            phone: '0123',
            email: 'client@gmail.com',
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet',
            __v: 0,
            modifieds:
                [{
                    dataBackup: JSON.stringify(oldClient),
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: true,
            medicalHistory: []
        };
        deepEqual(result, resExpected);
    });

    it('Cannot enable remove branch', async () => {
        await Client.findByIdAndRemove(clientId);
        const response = await request(app)
            .put('/client/enable/' + clientId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ClientError.CANNOT_FIND_CLIENT);
    });

    it('Cannot enable with invalid id', async () => {
        const response = await request(app)
            .put('/client/enable/123')
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, 'INVALID_ID');
    });
});