import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, UserError, Branch } from '../../src/refs';

describe('PUT /branch/', () => {
    let userId: string, token: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.createRootBranch();
        userId = dataInit.rootUser._id.toString();
        token = dataInit.rootUser.token.toString();
        branchId = dataInit.masterBranch._id.toString();
    });

    it('Can update branch', async () => {
        const dataSend = {
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
        }
        const response = await request(app).put('/branch/' + branchId)
            .set({ token }).send(dataSend);
        const { success, result } = response.body;
        equal(response.status, 200);
        equal(success, true);
        const resExpected: any = {
            _id: branchId,
            sid: 1,
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isMaster: true
        }
        deepEqual(result, resExpected);
        // Check database
        const branchDb = await Branch.findById(branchId) as Branch;
        equal(branchDb.name, 'Name update');
        equal(branchDb.email, 'branchupdate@gmail.com');
        equal(branchDb.phone, '0908508136 update');
        equal(branchDb.city, 'HCM update');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).name, 'Branch name');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).email, 'brand@gmail.com');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).phone, '0909');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).city, 'HCM');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).district, 'Phu Nhuan');
        equal(JSON.parse(branchDb.modifieds[0].dataBackup).address, 'Address');
    });
});