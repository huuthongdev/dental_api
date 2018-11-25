import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, Service, SID_START_AT, RemoveService } from '../../src/refs';

describe('PUT /enable/:serviceId', () => {
    let token: string, userId: string, serviceId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can enable service', async () => {
        await Service.findByIdAndUpdate(serviceId, { isActive: false });
        const response = await request(app)
            .put('/service/enable/' + serviceId).set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: serviceId,
            sid: result.sid,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: result.createBy,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot enable removed service', async () => {
        await Service.findByIdAndRemove(serviceId);
        const response = await request(app)
            .put('/service/enable/' + serviceId).set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });

});