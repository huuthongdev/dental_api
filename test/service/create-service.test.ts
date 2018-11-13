import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, ServiceError, CreateService, Service, SID_START_AT, CreateProductService, AccessorieItem } from '../../src/refs';

describe('POST /service', () => {
    let token: string, userId: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can create new Service', async () => {
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            __v: 0,
            sid: SID_START_AT,
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            serviceMetaes: [],
            accessories: [],
            isActive: true,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Can create new Service with accessories', async () => {
        const product1 = await CreateProductService.create(userId, 'Product 1', 100, 'VN', 'Unit', 50);
        const product2 = await CreateProductService.create(userId, 'Product 2', 200, 'VN', 'Unit', 100);
        const accessories: AccessorieItem[] = [{ product: product1._id, qty: 2 }, { product: product2._id, qty: 3 }];
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories,
            unit: 'Unit'
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: result._id,
            sid: SID_START_AT,
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [{
                product:
                {
                    _id: product1._id.toString(),
                    sid: SID_START_AT,
                    name: 'Product 1',
                    cost: 50
                },
                qty: 2,
                _id: result.accessories[0]._id
            },
            {
                product:
                {
                    _id: product2._id.toString(),
                    sid: SID_START_AT + 1,
                    name: 'Product 2',
                    cost: 100
                },
                qty: 3,
                _id: result.accessories[1]._id
            }],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot create new Service without name', async () => {
        const dataSend = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
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
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot create new Service without unit', async () => {
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            // unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.UNIT_MUST_BE_PROVIDED);
    });

    it('Cannot create new Service with twice a name', async () => {
        await CreateService.create(userId, 'Service Name', 200, [], [], 'Unit', 200);
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        }
        const response = await request(app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ServiceError.NAME_IS_EXISTED);
    });
});