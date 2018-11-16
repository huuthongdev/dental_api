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
describe('POST /user/', () => {
    let token, userId, branchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
    }));
    it('Can create new user', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend);
        assert_1.equal(response.status, 200);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        const resExpected = {
            sid: refs_1.SID_START_AT + 1,
            isActive: true,
            __v: 0,
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            birthday: 850237200000,
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [],
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Can create new user with role in branch', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town',
            branchWorkId: branchId,
            branchRole: refs_1.Role.CUSTOMER_CARE_MANAGER
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend);
        assert_1.equal(response.status, 200);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        const resExpected = {
            sid: refs_1.SID_START_AT + 1,
            isActive: true,
            __v: 0,
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            birthday: result.birthday,
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: [{
                    _id: result.roleInBranchs[0]._id,
                    branch: {
                        _id: branchId,
                        sid: refs_1.SID_START_AT,
                        name: 'Branch Name',
                        isMaster: true
                    },
                    __v: 0,
                    roles: ['CUSTOMER_CARE_MANAGER']
                }]
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create new user with empty required input', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            // name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.UserError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'User name',
            // email: 'email@gmail.com',
            phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.UserError.EMAIL_MUST_BE_PROVIDED);
        const dataSend3 = {
            name: 'User name',
            email: 'email@gmail.com',
            // phone: 'User phone',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend3);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.message, refs_1.UserError.PHONE_MUST_BE_PROVIDED);
        const dataSend4 = {
            name: 'User name',
            email: 'email@gmail.com',
            phone: 'User phone',
            // password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res4 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend4);
        assert_1.equal(res4.status, 400);
        assert_1.equal(res4.body.message, refs_1.UserError.PASSWORD_MUST_BE_PROVIDED);
    }));
    it('Cannot create new user errors unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateUserService.create(userId, 'Name unique', 'email@gmail.com', '090', 'Password');
        const dataSend1 = {
            name: 'user name',
            email: 'email@gmail.com',
            phone: '0909777',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.UserError.EMAIL_IS_EXISTED);
        const dataSend2 = {
            name: 'user name',
            email: 'emaildifferent@gmail.com',
            phone: '090',
            password: 'User password',
            birthday: new Date(1996, 11, 11).getTime(),
            city: 'User city',
            district: 'User district',
            address: 'User address',
            homeTown: 'User home town'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/user').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.UserError.PHONE_IS_EXISTED);
    }));
});
