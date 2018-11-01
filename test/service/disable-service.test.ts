import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, Service, SID_START_AT } from '../../src/refs';

describe('PUT /disable/:serviceId', () => {
    let token: string, userId: string, serviceId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.createService();
        token = dataInit.rootUser.token.toString();
        userId = dataInit.rootUser._id.toString();
        serviceId = dataInit.service._id.toString();
        branchId = dataInit.branchMaster._id.toString();
    });

    it('Can disable service', async () => {
        const response = await request(app)
            .put('/service/disable/' + serviceId).set({ token, branch: branchId  });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: serviceId,
            sid: SID_START_AT,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: result.createBy,
            __v: 0,
            modifieds:
                [{
                    dataBackup: `{"_id":"${serviceId}","sid":${SID_START_AT},"name":"Service name","suggestedRetailerPrice":100,"isActive":true,"serviceMetaes":[],"accessories":[],"basicProcedure":["Quy trinh"]}`,
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: false,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh']
        };
        deepEqual(result, resExpected);
    });

    it('Cannot disable removed service', async () => {
        await Service.findByIdAndRemove(serviceId);
        const response = await request(app)
            .put('/service/disable/' + serviceId).set({ token, branch: branchId  });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });

});