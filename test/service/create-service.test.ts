import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InitDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, CreateService } from '../../src/refs';

describe('POST /service', () => {
    let token: string, userId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInit = await InitDatabaseForTest.createRootBranch();
        token = dataInit.rootUser.token.toString();
        userId = dataInit.rootUser._id.toString();
    });

    it('Can create new Service', async () => {
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            __v: 0,
            sid: 1,
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh']
        };
        deepEqual(result, resExpected);
    });

    it('Cannot create new Service without name', async () => {
        const dataSend = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.NAME_MUST_BE_PROVIDED);
    });

    it('Cannot create new Service without suggestedRetailerPrice', async () => {
        const dataSend = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot create new Service with twice a name', async () => {
        await CreateService.create(userId, 'Service Name', 200, [], []);
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.NAME_IS_EXISTED);
    });
});