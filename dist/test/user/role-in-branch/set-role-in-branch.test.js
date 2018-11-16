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
const init_database_for_test_1 = require("../../../test/init-database-for-test");
const refs_1 = require("../../../src/refs");
describe('POST /user/set-role-in-branch/:branchId', () => {
    let userId, branchId, token, branchName, normalBranchId, normalBranchName;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        branchName = dataInitial.branchMaster.name;
        normalBranchId = dataInitial.normalBranch._id.toString();
        normalBranchName = dataInitial.normalBranch.name.toString();
    }));
    it('Can set role in current branch for user', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            userId,
            branchId,
            roles: [refs_1.Role.ADMIN, refs_1.Role.ACCOUNTANT, refs_1.Role.CUSTOMER_CARE_MANAGER]
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: userId,
            sid: refs_1.SID_START_AT,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Can set role in deferent branch', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            userId,
            branchId: normalBranchId,
            roles: [refs_1.Role.ACCOUNTANT, refs_1.Role.CUSTOMER_CARE_MANAGER]
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: userId,
            sid: refs_1.SID_START_AT,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot set role in branch with removed branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Branch.findByIdAndRemove(normalBranchId);
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: [refs_1.Role.ACCOUNTANT, refs_1.Role.CUSTOMER_CARE_MANAGER]
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(response.body.success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(response.body.message, refs_1.BranchError.CANNOT_FIND_BRANCH);
    }));
    it('Cannot set role in branch with removed user', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.User.findByIdAndRemove(userId);
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: [refs_1.Role.ACCOUNTANT, refs_1.Role.CUSTOMER_CARE_MANAGER]
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(response.body.success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(response.body.message, refs_1.UserError.CANNOT_FIND_USER);
    }));
    it('Cannot set role with invalid role', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            userId,
            branchId: normalBranchId,
            roles: ['ROLE_INVALID']
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/set-role-in-branch').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(response.body.success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(response.body.message, refs_1.RoleInBranchError.INVALID_ROLE);
    }));
});
