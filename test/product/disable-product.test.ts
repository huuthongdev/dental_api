import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ProductError, CreateProductService, CreateUserService, LoginService, UserError, Product } from '../../src/refs';

describe('PUT /product/disable/:productId', () => {
    let userId: string, token: string, branchId: string, productId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.createProduct();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        productId = dataInitial.product._id.toString();
    });

    it('Can disable product', async () => {
        const response = await request(app)
            .put('/product/disable/' + productId).set({ token, branch: branchId });
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            _id: productId,
            sid: SID_START_AT,
            name: 'Product Name',
            suggestedRetailerPrice: 100,
            origin: 'VN',
            createBy: userId,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isActive: false,
            cost: 200,
            productMetaes: [],
            unit: 'Unit'
        };
        deepEqual(result, resExpected);
    });

    it('Cannot disable removed service', async () => {
        await Product.findByIdAndRemove(productId);
        const response = await request(app)
            .put('/product/disable/' + productId).set({ token, branch: branchId });
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ProductError.CANNOT_FIND_PRODUCT);
    });
});