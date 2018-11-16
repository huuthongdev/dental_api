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
describe('POST /service', () => {
    let token, userId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can create new Service', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            __v: 0,
            sid: refs_1.SID_START_AT,
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
        assert_1.deepEqual(result, resExpected);
    }));
    it('Can create new Service with accessories', () => __awaiter(this, void 0, void 0, function* () {
        const product1 = yield refs_1.CreateProductService.create(userId, 'Product 1', 100, 'VN', 'Unit', 50);
        const product2 = yield refs_1.CreateProductService.create(userId, 'Product 2', 200, 'VN', 'Unit', 100);
        const accessories = [{ product: product1._id, qty: 2 }, { product: product2._id, qty: 3 }];
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories,
            unit: 'Unit'
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: result._id,
            sid: refs_1.SID_START_AT,
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            serviceMetaes: [],
            accessories: [{
                    product: {
                        _id: product1._id.toString(),
                        sid: refs_1.SID_START_AT,
                        name: 'Product 1',
                        cost: 50
                    },
                    qty: 2,
                    _id: result.accessories[0]._id
                },
                {
                    product: {
                        _id: product2._id.toString(),
                        sid: refs_1.SID_START_AT + 1,
                        name: 'Product 2',
                        cost: 100
                    },
                    qty: 3,
                    _id: result.accessories[1]._id
                }],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create new Service without name', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.NAME_MUST_BE_PROVIDED);
    }));
    it('Cannot create new Service without suggestedRetailerPrice', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    }));
    it('Cannot create new Service without unit', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.UNIT_MUST_BE_PROVIDED);
    }));
    it('Cannot create new Service with twice a name', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateService.create(userId, 'Service Name', 200, [], [], 'Unit', 200);
        const dataSend = {
            name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/service').set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.NAME_IS_EXISTED);
    }));
});
