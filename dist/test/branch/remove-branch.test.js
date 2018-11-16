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
describe('PUT /remove/:branchId', () => {
    let userId, token, branchId, branchMasterId, normalBranchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    }));
    it('Can remove branch', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .delete('/branch/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: normalBranchId,
            sid: refs_1.SID_START_AT + 1,
            name: 'Normal Branch',
            email: 'normalbranch@gmail.com',
            phone: '0123',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'Address',
            createBy: userId,
            __v: 0,
            isActive: true,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false
        };
        assert_1.deepEqual(result, resExpected);
        // Check database
        const branchDb = yield refs_1.Branch.findById(normalBranchId);
        assert_1.equal(branchDb, undefined);
    }));
    it('Can remove branch and check data related', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.SetRoleInBranchService.set(userId, normalBranchId, [refs_1.Role.DENTIST, refs_1.Role.CUSTOMER_CARE]);
        const userDbBefore = yield refs_1.GetUserInfo.get(userId);
        assert_1.equal(userDbBefore.roleInBranchs.length, 2);
        const response = yield supertest_1.default(refs_1.app)
            .delete('/branch/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const userDbAfter = yield refs_1.GetUserInfo.get(userId);
        assert_1.equal(userDbAfter.roleInBranchs.length, 1);
    }));
    it('Cannot remove removed branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Branch.findByIdAndRemove(normalBranchId);
        const response = yield supertest_1.default(refs_1.app)
            .delete('/branch/' + normalBranchId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.BranchError.CANNOT_FIND_BRANCH);
    }));
    it('Cannot disable with invalid id', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .delete('/branch/' + 'branchId')
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, 'INVALID_ID');
    }));
    it('Cannot remove master branch', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .delete('/branch/' + branchId)
            .set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.BranchError.CANNOT_REMOVE_MASTER_BRANCH);
    }));
});
