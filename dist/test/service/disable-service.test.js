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
describe('PUT /disable/:serviceId', () => {
    let token, userId, serviceId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can disable service', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/disable/' + serviceId).set({ token, branch: branchId });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: serviceId,
            sid: result.sid,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: result.createBy,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isActive: false,
            serviceMetaes: [],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot disable removed service', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Service.findByIdAndRemove(serviceId);
        const response = yield supertest_1.default(refs_1.app)
            .put('/service/disable/' + serviceId).set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.CANNOT_FIND_SERVICE);
    }));
});
