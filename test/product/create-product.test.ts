import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, SID_START_AT, ProductError, CreateProductService, CreateUserService, LoginService, UserError } from '../../src/refs';

describe('POST /product', () => {
    let userId: string, token: string, branchId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.loginRootAccount();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
    });

    it('Can create product', async () => {
        const dataSend = {
            name: 'Product name',
            suggestedRetailerPrice: 300,
            origin: 'VN'
        }
        const response = await request(app)
            .post('/product').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
            __v: 0,
            sid: SID_START_AT,
            name: 'Product name',
            suggestedRetailerPrice: 300,
            origin: 'VN',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            productMetaes: [],
            cost: 0
        }
        deepEqual(result, resExpected);
    });

    it('Cannot create product with errors required', async () => {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            origin: 'VN'
        }
        const res1 = await request(app)
            .post('/product').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, ProductError.NAME_MUST_BE_PROVIDED);

        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            origin: 'VN'
        }
        const res2 = await request(app)
            .post('/product').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, false);
        equal(res2.status, 400);
        equal(res2.body.message, ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    });

    it('Cannot create product with errors unique', async () => {
        await CreateProductService.create(userId, 'Product Name', 100, 'VN', 20);
        const dataSend = {
            name: 'Product Name',
            suggestedRetailerPrice: 300,
            origin: 'VN'
        }
        const response = await request(app)
            .post('/product').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        equal(success, false);
        equal(response.status, 400);
        equal(message, ProductError.NAME_IS_EXISTED);
    });

    // it('Cannot create product with not chairman', async () => {
    //     await CreateUserService.create(userId, 'normal', 'normaluser@gmail.com', '0123', 'password');
    //     const tokenNormalUser = await LoginService.login('0123', undefined, 'password');
    //     const dataSend = {
    //         name: 'Product Name',
    //         suggestedRetailerPrice: 300,
    //         origin: 'VN'
    //     }
    //     const response = await request(app)
    //         .post('/product').set({ token: tokenNormalUser.token, branch: branchId }).send(dataSend);
    //     const { success, message } = response.body;
    //     equal(success, false);
    //     equal(response.status, 400);
    //     equal(message, UserError.PERMISSION_DENIED);
    // });
});