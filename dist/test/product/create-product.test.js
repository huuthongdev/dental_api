"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const assert_1 = require("assert");
const init_database_for_test_1 = require("../../test/init-database-for-test");
const refs_1 = require("../../src/refs");
describe('POST /product', () => {
    let userId, token, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can create product', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Product name',
            suggestedRetailerPrice: 300,
            origin: 'VN',
            unit: 'Unit'
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/product').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            __v: 0,
            sid: result.sid,
            name: 'Product name',
            suggestedRetailerPrice: 300,
            origin: 'VN',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            productMetaes: [],
            cost: 0,
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create product with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            origin: 'VN',
            unit: 'Unit'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/product').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.ProductError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            origin: 'VN',
            unit: 'Unit'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/product').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    }));
    it('Cannot create product with errors unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateProductService.create(userId, { name: 'Product Name', suggestedRetailerPrice: 100, origin: 'VN', unit: 'Unit' });
        const dataSend = {
            name: 'Product Name',
            suggestedRetailerPrice: 300,
            origin: 'VN',
            unit: 'Unit'
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/product').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ProductError.NAME_IS_EXISTED);
    }));
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
