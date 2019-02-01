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
describe('POST /user/log-in', () => {
    it('Can login with Email', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: refs_1.ROOT_EMAIL, password: refs_1.DEFAULT_PASSWORD });
        assert_1.equal(response.status, 200);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        const resExpected = {
            _id: result._id,
            sid: refs_1.SID_START_AT,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
            token: result.token
        };
        assert_1.deepEqual(response.body.result, resExpected);
    }));
    it('Can login with Phone', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: refs_1.ROOT_PHONE, password: refs_1.DEFAULT_PASSWORD });
        assert_1.equal(response.status, 200);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        const resExpected = {
            _id: result._id,
            sid: refs_1.SID_START_AT,
            name: refs_1.ROOT_NAME,
            email: refs_1.ROOT_EMAIL,
            phone: refs_1.ROOT_PHONE,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            roleInBranchs: result.roleInBranchs,
            isActive: true,
            token: result.token
        };
        assert_1.deepEqual(response.body.result, resExpected);
    }));
    it('Cannot login with invalid info', () => __awaiter(this, void 0, void 0, function* () {
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: 'ROOT_PHONE', password: refs_1.DEFAULT_PASSWORD });
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.UserError.INVALID_LOG_IN_INFO);
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: 'ROOT_PHONE', password: refs_1.DEFAULT_PASSWORD });
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.UserError.INVALID_LOG_IN_INFO);
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: refs_1.ROOT_EMAIL, password: 'DEFAULT_PASSWORD' });
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.body.message, refs_1.UserError.INVALID_LOG_IN_INFO);
    }));
    it('Cannot login with removed user', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.User.remove({});
        const response = yield supertest_1.default(refs_1.app)
            .post('/user/log-in').send({ loginInfo: refs_1.ROOT_EMAIL, password: refs_1.DEFAULT_PASSWORD });
        assert_1.equal(response.status, 400);
        assert_1.equal(response.body.success, false);
        assert_1.equal(response.body.message, refs_1.UserError.INVALID_LOG_IN_INFO);
    }));
});
