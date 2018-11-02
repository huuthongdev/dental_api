import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ProductError, CreateProductService, CreateUserService, LoginService, UserError } from '../../src/refs';

describe('PUT /product/:productId', () => {
    let userId: string, token: string, branchId: string, productId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createProduct();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        productId = dataInitial.product._id.toString();
    });

    it('Can update product', async () => {
        const dataSend = {
            name: 'Product name update',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            cost: 200
        };
        const response = await request(app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: productId,
            sid: SID_START_AT,
            name: 'Product name update',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            createBy: userId,
            __v: 0,
            modifieds:
                [{
                    dataBackup: result.modifieds[0].dataBackup,
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: true,
            cost: 200,
            productMetaes: []
        };
        deepEqual(result, resExpected);
    });

    it('Cannot update with errors required', async () => {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
        }
        const res1 = await request(app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, ProductError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
        }
        const res2 = await request(app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, false);
        equal(res2.status, 400);
        equal(res2.body.message, ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot update with errors unique', async () => {
        await CreateProductService.create(userId, 'Product 2', 100, 'VN', 300);
        const dataSend = {
            name: 'Product 2',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            cost: 200
        };
        const response = await request(app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ProductError.NAME_IS_EXISTED);
    });
});