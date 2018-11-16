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
describe('POST /branch/', () => {
    let userId, token, brandId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.loginRootAccount();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        brandId = dataInitial.branchMaster._id.toString();
    }));
    it('Can create new Branch', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(response.status, 200);
        assert_1.equal(success, true);
        const resExpected = {
            __v: 0,
            sid: refs_1.SID_START_AT + 1,
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            isMaster: false,
            isActive: true
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create new Branch with invalid input', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            // name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        assert_1.equal(res.status, 400);
        assert_1.equal(res.body.success, false);
        assert_1.equal(res.body.message, refs_1.BranchError.NAME_MUST_BE_PROVIDED);
    }));
    it('Cannot create new Branch error unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateBranchService.create(userId, 'Name', 'branch@gmail.com', '0908557899', 'HCM', 'Phu Nhuan', 'Address');
        const dataSend1 = {
            name: 'Name',
            email: 'branch2@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.BranchError.NAME_IS_EXISTED);
        const dataSend2 = {
            name: 'Name 2',
            email: 'branch@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.BranchError.EMAIL_IS_EXISTED);
        const dataSend3 = {
            name: 'Name 2',
            email: 'branch2@gmail.com',
            phone: '0908557899',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend3);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.body.message, refs_1.BranchError.PHONE_IS_EXISTED);
    }));
    it('Cannot create two master Branch', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
            isMaster: true
        };
        const res = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: brandId }).send(dataSend);
        assert_1.equal(res.status, 400);
        assert_1.equal(res.body.success, false);
        assert_1.equal(res.body.message, refs_1.BranchError.ONLY_ONE_MASTER_BRANCH);
    }));
    // it('Cannot create new branch by a user not chairman', async () => {
    //     await CreateUserService.create(userId, 'Normal User', 'normal@gmail.com', '0123', 'password');
    //     const normalUser = await LoginService.login('0123', undefined ,'password');
    //     const dataSend = {
    //         name: 'Name branch',
    //         email: 'branch@gmail.com',
    //         phone: '0908508136',
    //         city: 'HCM',
    //         district: 'Phu Nhuan',
    //         address: 'address',
    //         isMaster: true
    //     }
    //     const res = await request(app)
    //         .post('/branch/').set({ token: normalUser.token, branch: brandId }).send(dataSend);
    //     equal(res.status, 400);
    //     equal(res.body.success, false);
    //     equal(res.body.message, UserError.PERMISSION_DENIED);
    // });
});
