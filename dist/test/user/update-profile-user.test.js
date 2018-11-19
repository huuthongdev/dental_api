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
describe('PUT /user/:userUpdateId', () => {
    let token, userId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can update profile user', () => __awaiter(this, void 0, void 0, function* () {
        const birthday = Date.now();
        const dataSend = {
            name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: userId,
            sid: refs_1.SID_START_AT,
            name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            __v: 0,
            address: 'address update',
            birthday,
            city: 'HCM Update',
            district: 'district Update',
            homeTown: 'homeTown Update',
            roleInBranchs: result.roleInBranchs,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isActive: true
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const birthday = Date.now();
        const dataSend1 = {
            // name: 'Update',
            email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        };
        const response1 = yield supertest_1.default(refs_1.app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(response1.body.success, false);
        assert_1.equal(response1.status, 400);
        assert_1.equal(response1.body.message, refs_1.UserError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'Update',
            // email: 'update@gmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        };
        const response2 = yield supertest_1.default(refs_1.app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(response2.body.success, false);
        assert_1.equal(response2.status, 400);
        assert_1.equal(response2.body.message, refs_1.UserError.EMAIL_MUST_BE_PROVIDED);
        const dataSend3 = {
            name: 'Update',
            email: 'updategmail.com',
            phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        };
        const response3 = yield supertest_1.default(refs_1.app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend3);
        assert_1.equal(response3.body.success, false);
        assert_1.equal(response3.status, 400);
        assert_1.equal(response3.body.message, refs_1.UserError.EMAIL_INCORRECT);
        const dataSend4 = {
            name: 'Update',
            email: 'update@gmail.com',
            // phone: '0900099911',
            city: 'HCM Update',
            district: 'district Update',
            address: 'address update',
            homeTown: 'homeTown Update',
            birthday
        };
        const response4 = yield supertest_1.default(refs_1.app)
            .put('/user/' + userId).set({ token, branch: branchId }).send(dataSend4);
        assert_1.equal(response4.body.success, false);
        assert_1.equal(response4.status, 400);
        assert_1.equal(response4.body.message, refs_1.UserError.PHONE_MUST_BE_PROVIDED);
    }));
});
