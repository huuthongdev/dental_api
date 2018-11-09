import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, CreateService, Service, SID_START_AT } from '../../src/refs';

describe('GET /service', () => {
    let token: string, userId: string, serviceId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        // Create more services
        await CreateService.create(userId, 'Service 1', 100, [], [], 'Unit');
    });

    it('Can get all services', async () => {
        const response = await request(app)
            .get('/service').set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = [{
            _id: serviceId,
            sid: SID_START_AT,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result[0].createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        },
        {
            _id: result[1]._id,
            sid: SID_START_AT + 1,
            name: 'Service 1',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result[1].createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: [],
            unit: 'Unit'
        }];
        deepEqual(result, resExpected);
    });

});