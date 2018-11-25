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
describe('POST /client/:clientId', () => {
    let token, userId, branchId, normalBranchId, clientId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
    }));
    it('Can update client', () => __awaiter(this, void 0, void 0, function* () {
        const oldClient = yield refs_1.Client.findById(clientId).select(refs_1.modifiedSelect);
        const dataSend = {
            name: 'Client update',
            email: 'clientupdate@gmail.com',
            phone: '0908557899 update',
            birthday: Date.now(),
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: '95/54 Huynh Van Banh update',
            homeTown: 'Phan Thiet update'
        };
        const response = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: clientId,
            sid: refs_1.SID_START_AT,
            createBy: userId,
            name: 'Client update',
            phone: '0908557899 update',
            email: 'clientupdate@gmail.com',
            birthday: result.birthday,
            city: 'HCM update',
            district: 'Phu Nhuan update',
            address: '95/54 Huynh Van Banh update',
            homeTown: 'Phan Thiet update',
            __v: 0,
            modifieds: [{
                    dataBackup: JSON.stringify(oldClient).toString(),
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            isActive: true,
            medicalHistory: null,
            gender: refs_1.Gender.OTHER
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update client with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend1 = {
            // name: 'Client',
            email: 'client@gmail.com',
            phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.ClientError.NAME_MUST_BE_PROVIDED);
        const dataSend2 = {
            name: 'Client',
            email: 'client@gmail.com',
            // phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.ClientError.PHONE_MUST_BE_PROVIDED);
    }));
    it('Cannot update client with errors unique', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateClientService.create(userId, { name: 'Name01', phone: '012301', email: 'email01@gmail.com', birthday: Date.now() });
        const dataSend1 = {
            name: 'Name',
            email: '2@gmail.com',
            phone: '012301',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.ClientError.PHONE_IS_EXISTED);
        const dataSend2 = {
            name: 'Name',
            email: 'email01@gmail.com',
            phone: '0223',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.ClientError.EMAIL_IS_EXISTED);
    }));
    it('Cannot update a remove client', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Client.findByIdAndRemove(clientId);
        const dataSend1 = {
            name: 'Client',
            email: 'client@gmail.com',
            phone: '0908557899',
            birthday: Date.now(),
            city: 'HCM',
            district: 'Phu Nhuan',
            address: '95/54 Huynh Van Banh',
            homeTown: 'Phan Thiet'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/client/' + clientId).set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.ClientError.CANNOT_FIND_CLIENT);
    }));
});
