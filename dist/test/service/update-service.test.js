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
describe('PUT /service/:serviceId', () => {
    let token, userId, serviceId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can update service', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Service Name Update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
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
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update with required input', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            // name: 'Service Name',
            suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories: [],
            unit: 'Unit'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.ServiceError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'Service Name',
            // suggestedRetailerPrice: 100,
            basicProcedure: ['Quy trinh'],
            accessories: [],
            unit: 'Unit'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.ServiceError.SUGGESTED_RETAILER_PRICE_MUST_BE_PROVIDED);
    }));
    it('Cannot update with a existed name', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateService.create(userId, 'Exited Name', 200, [], [], 'Unit', 200);
        const dataSend = {
            name: 'Exited Name',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.NAME_IS_EXISTED);
    }));
    it('Cannot update a remove service', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Service.findByIdAndRemove(serviceId);
        const dataSend = {
            name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.CANNOT_FIND_SERVICE);
    }));
    it('Cannot update without name', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            // name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
            unit: 'Unit'
            // accessories: []
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.NAME_MUST_BE_PROVIDED);
    }));
    it('Cannot update without unit', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Name update',
            suggestedRetailerPrice: 200,
            basicProcedure: ['Quy trinh update'],
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/' + serviceId).set({ token, branch: branchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.UNIT_MUST_BE_PROVIDED);
    }));
});
