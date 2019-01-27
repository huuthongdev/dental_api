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
describe('Check have role middleware', () => {
    let token, branchId, userId, dentistId, normalBranchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testGetAllUserInCurrentBranch();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    }));
    it('Can access with valid role with admin', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .get('/dev/middleware/must-have-role')
            .set({ token, branch: branchId });
        const { error, success } = response.body;
        assert_1.equal(success, true);
    }));
    it('Can access with valid role with dentist', () => __awaiter(this, void 0, void 0, function* () {
        const dentist = yield refs_1.LoginService.login('user2@gmail.com', 'password');
        const response = yield supertest_1.default(refs_1.app)
            .get('/dev/middleware/must-have-role')
            .set({ token: dentist.token, branch: normalBranchId });
        const { error, success } = response.body;
        assert_1.equal(success, true);
    }));
});
