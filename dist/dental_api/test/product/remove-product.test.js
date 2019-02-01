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
describe('DELETE /product/:productId', () => {
    let userId, token, branchId, productId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createProduct();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        productId = dataInitial.product._id.toString();
    }));
    it('Can remove product', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .delete('/product/' + productId).set({ token, branch: branchId });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: productId,
            sid: result.sid,
            name: 'Product Name',
            suggestedRetailerPrice: 100,
            origin: 'VN',
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            cost: 200,
            productMetaes: [],
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
        // Check database
        const productDb = yield refs_1.Product.findById(productId);
        assert_1.equal(productDb, undefined);
    }));
    it('Cannot remove removed service', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Product.findByIdAndRemove(productId);
        const response = yield supertest_1.default(refs_1.app)
            .delete('/product/' + productId).set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ProductError.CANNOT_FIND_PRODUCT);
    }));
});
