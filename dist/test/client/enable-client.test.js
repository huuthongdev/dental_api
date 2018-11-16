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
describe('PUT /client/enable/:clientId', () => {
    let token, userId, branchId, normalBranchId, clientId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
        yield refs_1.Client.findByIdAndUpdate(clientId, { isActive: false });
    }));
    it('can enable client', () => __awaiter(this, void 0, void 0, function* () {
        const oldClient = yield refs_1.Client.findById(clientId).select(refs_1.modifiedSelect);
        const response = yield supertest_1.default(refs_1.app)
            .put('/client/enable/' + clientId).set({ token, branch: branchId });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: clientId,
            sid: refs_1.SID_START_AT,
            createBy: userId,
            name: 'Client',
            phone: '0123',
            email: 'client@gmail.com',
            birthday: result.birthday,
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet',
            __v: 0,
            modifieds: [{
                    dataBackup: JSON.stringify(oldClient),
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: true,
            medicalHistory: []
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot enable remove branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Client.findByIdAndRemove(clientId);
        const response = yield supertest_1.default(refs_1.app)
            .put('/client/enable/' + clientId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ClientError.CANNOT_FIND_CLIENT);
    }));
    it('Cannot enable with invalid id', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .put('/client/enable/123')
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, 'INVALID_ID');
    }));
});
