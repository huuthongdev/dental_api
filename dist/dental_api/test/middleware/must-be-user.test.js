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
const refs_1 = require("../../src/refs");
const init_database_for_test_1 = require("../../test/init-database-for-test");
describe('Check must be user middleware', () => {
    let token, branchId, userId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can next with valid info', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
    }));
    it('Cannot next with empty token', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, 'INVALID_TOKEN');
    }));
    it('Cannot next with empty branch', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ token });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, 'BRANCH_ID_MUST_BE_PROVIDED');
    }));
    it('Cannot next when removed user', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.User.findByIdAndRemove(userId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.UserError.CANNOT_FIND_USER);
    }));
    it('Cannot next when removed branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Branch.findByIdAndRemove(branchId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.BranchError.CANNOT_FIND_BRANCH);
    }));
    it('Cannot next when disabled branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.RemoveBranchService.disable(userId, branchId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/dev/middleware/must-be-user').set({ token, branch: branchId });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.BranchError.BRANCH_IS_DISABLED);
    }));
});
