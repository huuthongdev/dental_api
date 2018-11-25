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
        await CreateService.create(userId, 'Service 1', 100, [], [], 'Unit', 200);
    });

    it('Can get all services', async () => {
        const response = await request(app)
            .get('/service').set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
    });

});