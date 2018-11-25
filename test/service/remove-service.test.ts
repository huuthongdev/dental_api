import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { app, SID_START_AT, Service, ServiceError } from '../../src/refs';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';

describe('DELETE /service/:serviceId', () => {
    let token: string, userId: string, serviceId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can remove service', async () => {
        const response = await request(app)
            .delete('/service/' + serviceId).set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: serviceId,
            sid: result.sid,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
        // Check database
        const serviceDb: any = await Service.findById(serviceId);
        equal(serviceDb, undefined);
    });

    it('Cannot remove a removed service', async () => {
        await Service.findByIdAndRemove(serviceId);
        const response = await request(app)
            .delete('/service/' + serviceId).set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });
});