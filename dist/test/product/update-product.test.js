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
describe('PUT /product/:productId', () => {
    let userId, token, branchId, productId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createProduct();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        productId = dataInitial.product._id.toString();
    }));
    it('Can update product', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Product name update',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            cost: 200,
            unit: 'Unit'
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: productId,
            sid: result.sid,
            name: 'Product name update',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            createBy: userId,
            __v: 0,
            modifieds: [{
                    dataBackup: result.modifieds[0].dataBackup,
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: true,
            cost: 200,
            productMetaes: [],
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            unit: 'Unit'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.ProductError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            unit: 'Unit'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.ProductError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    }));
    it('Cannot update with errors unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateProductService.create(userId, { name: 'Product 2', suggestedRetailerPrice: 100, origin: 'VN', unit: 'Unit', cost: 200 });
        const dataSend = {
            name: 'Product 2',
            suggestedRetailerPrice: 500,
            origin: 'USA',
            cost: 200,
            unit: 'Unit'
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/product/' + productId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ProductError.NAME_IS_EXISTED);
    }));
});
