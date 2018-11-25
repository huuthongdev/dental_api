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
describe('PUT /branch/:branchId', () => {
    let userId, token, branchId, normalBranchId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createNormalBranch();
        userId = dataInitial.rootUser._id.toString();
        token = dataInitial.rootUser.token.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
    }));
    it('Can update branch', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
        };
        const response = yield supertest_1.default(refs_1.app).put('/branch/' + normalBranchId)
            .set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(response.status, 200);
        assert_1.equal(success, true);
        const resExpected = {
            _id: normalBranchId,
            sid: refs_1.SID_START_AT + 1,
            name: 'Name update',
            email: 'branchupdate@gmail.com',
            phone: '0908508136 update',
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: 'address update',
            createBy: userId,
            __v: 0,
            modifieds: result.modifieds,
            createAt: result.createAt,
            isMaster: false,
            isActive: true
        };
        assert_1.deepEqual(result, resExpected);
        // Check database
        const branchDb = yield refs_1.Branch.findById(normalBranchId);
        assert_1.equal(branchDb.name, 'Name update');
        assert_1.equal(branchDb.email, 'branchupdate@gmail.com');
        assert_1.equal(branchDb.phone, '0908508136 update');
        assert_1.equal(branchDb.city, 'HCM update');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).name, 'Normal Branch');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).email, 'normalbranch@gmail.com');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).phone, '0123');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).city, 'HCM');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).district, 'Phu Nhuan');
        assert_1.equal(JSON.parse(branchDb.modifieds[0].dataBackup).address, 'Address');
    }));
    it('Cannot update: Error required', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = {
            // name: 'Name branch',
            email: 'branch@gmail.com',
            phone: '0908508136',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res = yield supertest_1.default(refs_1.app)
            .post('/branch/').set({ token, branch: branchId }).send(dataSend);
        assert_1.equal(res.status, 400);
        assert_1.equal(res.body.success, false);
        assert_1.equal(res.body.message, refs_1.BranchError.NAME_MUST_BE_PROVIDED);
    }));
    it('Cannot create new Branch error unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateBranchService.create(userId, { name: 'Name', email: 'branch22@gmail.com', phone: '0908557899222', city: 'HCM', district: 'Phu Nhuan', address: 'Address' });
        const dataSend1 = {
            name: 'Name',
            email: 'branch2@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.BranchError.NAME_IS_EXISTED);
        const dataSend2 = {
            name: 'Name 2',
            email: 'branch22@gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.BranchError.EMAIL_IS_EXISTED);
        const dataSend3 = {
            name: 'Name 2',
            email: 'branch2@gmail.com',
            phone: '0908557899222',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res3 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend3);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.body.message, refs_1.BranchError.PHONE_IS_EXISTED);
    }));
    it('Cannot update with invalid email', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.BranchError.EMAIL_INCORRECT);
    }));
    it('Cannot update removed branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Branch.findByIdAndRemove(branchId);
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + branchId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.BranchError.CANNOT_FIND_BRANCH);
    }));
    it('Cannot update with invalid id', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            name: 'Name',
            email: 'branch2gmail.com',
            phone: '09085081361',
            city: 'HCM',
            district: 'Phu Nhuan',
            address: 'address',
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/branch/' + 'branchId').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, 'INVALID_ID');
    }));
    // it('Cannot update new branch by a user not chairman', async () => {
    //     await CreateUserService.create(userId, 'Normal User', 'normal@gmail.com', '0123', 'password');
    //     const normalUser = await LoginService.login('0123', undefined ,'password');
    //     const dataSend = {
    //         name: 'Name branch update',
    //         email: 'branch@gmail.com',
    //         phone: '0908508136',
    //         city: 'HCM',
    //         district: 'Phu Nhuan',
    //         address: 'address',
    //         isMaster: true
    //     };
    //     const res = await request(app)
    //         .put('/branch/' + branchId).set({ token: normalUser.token, branch: branchId }).send(dataSend);
    //     equal(res.status, 400);
    //     equal(res.body.success, false);
    //     equal(res.body.message, UserError.PERMISSION_DENIED);
    // });
});
