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
const init_database_for_test_1 = require("../init-database-for-test");
describe('POST /user/change-password', () => {
    let token, userId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can change password', () => __awaiter(this, void 0, void 0, function* () {
        const oldUser = yield refs_1.User.findById(userId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/user/change-password').set({ token, branch: branchId }).send({ oldPassword: refs_1.DEFAULT_PASSWORD, newPassword: 'Perline@2018' });
        const { success, result } = response.body;
        assert_1.equal(response.status, 200);
        assert_1.equal(success, true);
        const resExpected = {
            _id: userId,
            sid: 10000,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot change password with old password incorrect', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/user/change-password').set({ token, branch: branchId }).send({ oldPassword: 'DEFAULT_PASSWORD', newPassword: 'Perline@2018' });
        const { success, message } = response.body;
        assert_1.equal(response.status, 400);
        assert_1.equal(success, false);
        assert_1.equal(message, refs_1.UserError.OLD_PASSWORD_INCORRECT);
    }));
});
