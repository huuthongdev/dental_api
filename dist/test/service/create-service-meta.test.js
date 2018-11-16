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
const { errors } = refs_1.CreateServiceMeta;
describe('POST /service/service-meta/:serviceId', () => {
    let token, userId, serviceId, normalBrandId, normalUserId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createService();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        serviceId = dataInitial.service._id.toString();
        normalBrandId = dataInitial.normalBranch._id.toString();
        // Set Direct
        yield refs_1.SetRoleInBranchService.set(userId, normalBrandId, [refs_1.Role.DIRECTOR]);
    }));
    it('Can create service meta', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 8000 });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: serviceId,
            sid: refs_1.SID_START_AT,
            name: 'Service name',
            suggestedRetailerPrice: 100,
            createBy: userId,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            isActive: true,
            serviceMetaes: [{
                    _id: result.serviceMetaes[0]._id,
                    service: serviceId,
                    price: 8000,
                    branch: normalBrandId,
                    __v: 0
                }],
            accessories: [],
            basicProcedure: ['Quy trinh'],
            unit: 'Unit'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create service meta without price', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({});
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, errors.PRICE_MUST_BE_PROVIDED);
    }));
    it('Cannot create service meta when had a service meta in current branch', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.CreateServiceMeta.create(serviceId, 80000, normalBrandId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 900000 });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, errors.SERVICE_META_IS_EXISTED_IN_CURRENT_BRANCH);
    }));
    it('Cannot create service meta with a remove service', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Service.findByIdAndRemove(serviceId);
        const response = yield supertest_1.default(refs_1.app)
            .post('/service/service-meta/' + serviceId).set({ token, branch: normalBrandId }).send({ price: 900000 });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.CANNOT_FIND_SERVICE);
    }));
    // it('Cannot create service meta with user is not direct in current branch', async () => {
    //     await CreateUserService.create(userId, 'Normal', 'normal@gmail.com', '09087777777', 'password');
    //     const userNormal = await LoginService.login(undefined, 'normal@gmail.com', 'password');
    //     const response = await request(app)
    //         .post('/service/service-meta/' + serviceId).set({ token: userNormal.token, branch: normalBrandId }).send({ price: 900000 });
    //     const { success, message } = response.body;
    //     equal(success, false);
    //     equal(response.status, 400);
    //     equal(message, UserError.PERMISSION_DENIED);
    // });
});
