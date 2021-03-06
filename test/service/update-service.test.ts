import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, CreateService, Service, SID_START_AT } from '../../src/refs';

describe('PUT /service/:serviceId', () => {
    let token: string, userId: string, serviceId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can update service', async () => {
        const dataSend = {
            name: 'Service Name Update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: serviceId,
            sid: result.sid,
            name: 'Service Name Update',
            suggestedRetailerPrice: 200,
            createBy: userId,
            __v: 0,
            modifieds: [{
                dataBackup: result.modifieds[0].dataBackup,
                updateBy: userId,
                updateAt: result.modifieds[0].updateAt,
                _id: result.modifieds[0]._id.toString()
            }],
            createAt: result.createAt,
            serviceMetaes: [],
            accessories: null,
            basicProcedure: ['Quy trinh update'],
            isActive: true,
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot update with required input', async () => {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories: [] as [],
            unit: 'Unit'
        }
        const res1 = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, ServiceError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories: [] as [],
            unit: 'Unit'
        }
        const res2 = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, false);
        equal(res2.status, 400);
        equal(res2.body.message, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot update with a existed name', async () => {
        await CreateService.create(userId, { name: 'Exited Name', suggestedRetailerPrice: 200, unit: 'Unit' });
        const dataSend = {
            name: 'Exited Name',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.NAME_IS_EXISTED);
    });

    it('Cannot update a remove service', async () => {
        await Service.findByIdAndRemove(serviceId);
        const dataSend = {
            name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.CANNOT_FIND_SERVICE);
    });

    it('Cannot update without name', async () => {
        const dataSend = {
            // name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.NAME_MUST_BE_PROVIDED);
    });

    it('Cannot update without unit', async () => {
        const dataSend = {
            name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            // unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.UNIT_MUST_BE_PROVIDED);
    });
});